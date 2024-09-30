import { Position } from 'src/employee/schema/employe.schema';
import { PromotionService } from './promotion.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Promotion } from './schema/promotion.schema';

@Controller('promotions')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Post(':id/promote')
  async promoteEmployee(
    @Param('id') id: string,
    @Body()
    promotionData: {
      newPosition: Position;
      newSalary: number;
      trainedBy: string;
      isTeamLeader: boolean;
      dateOfPromotion: string;
    },
  ) {
    return this.promotionService.promoteEmployee(
      id,
      promotionData.newPosition,
      promotionData.newSalary,
      promotionData.trainedBy,
      promotionData.isTeamLeader,
      promotionData.dateOfPromotion,
    );
  }

  @Get(':id/promotion-history')
  async getPromotionHistory(@Param('id') id: string) {
    return this.promotionService.getEmployeePromotionHistory(id);
  }

  @Get('/promotion-history')
  async getAllPromotionHistories(): Promise<Promotion[]> {
    return this.promotionService.getAllPromotionHistories();
  }
}
