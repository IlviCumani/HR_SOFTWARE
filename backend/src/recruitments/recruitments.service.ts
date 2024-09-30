import { UpdateRecruitmentDto } from './dto/UpdateRecruitments.dto';
import { Injectable } from '@nestjs/common';
import {
  OfferMade,
  Recruitment,
  RecruitmentStage,
} from './schemas/recruitment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { CreateRecruitmentDto } from './dto/Recruitments.dto';
import { PaginatedDTO } from 'src/paginationDTO/paginated.dto';
import { EventsService } from 'src/modules/events/events.service';
import { Status } from 'src/modules/events/schema/events.schema';

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectModel(Recruitment.name) private recruitmentModel: Model<Recruitment>,
    private readonly eventsService: EventsService,
  ) {}
  async createRecruitment(
    createRecruitmentDto: CreateRecruitmentDto,
  ): Promise<Recruitment> {
    try {
      const newRecruit = await new this.recruitmentModel(
        createRecruitmentDto,
      ).save();
      return newRecruit;
    } catch (error) {
      throw new Error(`Failed to create ${error}`);
    }
  }

  async getRecruitments() {
    return await this.recruitmentModel.find({ isDeleted: false });
  }

  createLookupPipeline(interviewRound: 'firstInterview' | 'secondInterview') {
    return {
      $lookup: {
        from: 'employees',
        let: {
          interviewers: { $ifNull: [`$${interviewRound}.interviewers`, []] },
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: [
                  '$_id',
                  {
                    $map: {
                      input: '$$interviewers',
                      as: 'interviewer',
                      in: { $toObjectId: '$$interviewer' },
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              surname: 1,
              position: 1,
              email: 1,
              role: 1,
              phoneNumber: 1,
            },
          },
        ],
        as: `${interviewRound}InterviewerDetails`,
      },
    };
  }
  async getRecruitmentWithInterviewerDetails(
    page: number,
    limit: number,
    filters: any,
  ) {
    const skip = (page - 1) * limit;

    filters = { ...filters, isDeleted: { $ne: true } };

    const itemCount = await this.recruitmentModel.countDocuments(filters);

    const dataPipeline: PipelineStage[] = [
      { $match: filters },
      this.createLookupPipeline('firstInterview'),
      this.createLookupPipeline('secondInterview'),
      this.createAddFields('firstInterview'),
      this.createAddFields('secondInterview'),
      {
        $project: {
          name: 1,
          surname: 1,
          email: 1,
          phoneNumber: 1,
          position: 1,
          stage: 1,
          reference: 1,
          cv: 1,
          submittedDate: 1,
          isDeleted: 1,
          deleteDate: 1,
          firstInterview: 1,
          secondInterview: 1,
          offerMade: 1,
          rejectReason: 1,
        },
      },
      { $sort: { submittedDate: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const data = await this.recruitmentModel.aggregate(dataPipeline);
    return new PaginatedDTO<any>(data, page, limit, itemCount);
  }

  createAddFields(interviewRound: 'firstInterview' | 'secondInterview') {
    return {
      $addFields: {
        [`${interviewRound}.interviewers`]: {
          $ifNull: [`$${interviewRound}InterviewerDetails`, []],
        },
      },
    };
  }
  async updateRecruitment(
    id: Types.ObjectId,
    updateRecruitmentDto: UpdateRecruitmentDto,
    creatorID: string,
  ) {
    try {
      const { name, surname, ...others } = updateRecruitmentDto;

      const updatedRecruitment = await this.recruitmentModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        updateRecruitmentDto,
        { new: true },
      );

      let interviewData;
      if (updateRecruitmentDto.stage === RecruitmentStage.FirstInterview) {
        interviewData = updateRecruitmentDto.firstInterview;
      } else if (
        updateRecruitmentDto.stage === RecruitmentStage.SecondInterview
      ) {
        interviewData = updateRecruitmentDto.secondInterview;
      }

      if (interviewData) {
        let event;
        const invitees = interviewData.interviewers.filter(
          (interviewer) => interviewer.toString() !== creatorID,
        );
        if (updatedRecruitment.eventID) {
          event = await this.eventsService.update(
            updatedRecruitment.eventID.toString(),
            {
              title: `Interview scheduled for ${name} ${surname}`,
              startDate: interviewData.date ?? new Date(),
              endDate: interviewData.date ?? new Date(),
              startTime: interviewData.date ?? new Date(),
              endTime: interviewData.date ?? new Date(),
              location: interviewData.location ?? '',
              invitees: invitees ?? [],
              status: Status.Scheduled,
              description: '',
              progress: '',
              createdAt: undefined,
              updatedAt: undefined,
              locationId: '',
              creatorId: creatorID,
            },
          );
        } else {
          event = await this.eventsService.create({
            title: `Interview scheduled for applicant: ${name} ${surname}`,
            startDate: interviewData.date ?? new Date(),
            endDate: interviewData.date ?? new Date(),
            startTime: interviewData.date ?? new Date(),
            endTime: interviewData.date ?? new Date(),
            location: interviewData.location ?? '',
            creatorId: creatorID,
            invitees: invitees ?? [],
            status: Status.Scheduled,
            isDeleted: false,
          });

          await this.recruitmentModel.findByIdAndUpdate(
            new Types.ObjectId(id),
            { eventID: event._id },
            { new: true },
          );
        }
      }

      const recruitmentWithDetails = await this.recruitmentModel.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        this.createLookupPipeline('firstInterview'),
        this.createLookupPipeline('secondInterview'),
        this.createAddFields('firstInterview'),
        this.createAddFields('secondInterview'),
        {
          $project: {
            name: 1,
            surname: 1,
            email: 1,
            phoneNumber: 1,
            position: 1,
            stage: 1,
            reference: 1,
            cv: 1,
            submittedDate: 1,
            isDeleted: 1,
            deleteDate: 1,
            firstInterview: 1,
            secondInterview: 1,
            offerMade: 1,
            rejectReason: 1,
            eventID: 1,
          },
        },
      ]);

      return recruitmentWithDetails[0] || null;
    } catch (error) {
      throw new Error('Failed to update recruitment: ' + error);
    }
  }

  async softDeleteRecruitById(id: string): Promise<Recruitment> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return this.recruitmentModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deleteDate: currentDate },
      { new: true },
    );
  }
  async getApplicationsPerMonth() {
    const year = new Date().getFullYear();

    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const dataset = await this.recruitmentModel.aggregate([
      {
        $match: {
          submittedDate: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { $month: '$submittedDate' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      count: 0,
    }));

    const result = allMonths.map((monthObj) => {
      const existing = dataset.find((item) => item._id === monthObj.month);
      return {
        label: monthObj.month,
        value: existing ? existing.count : 0,
      };
    });

    return result;
  }
}
