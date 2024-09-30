import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory, InventoryStatus } from './schemas/Inventory.schema';
import { Model, Types } from 'mongoose';
import { CreateInventoryDto } from './dto/createInventory.dto';
import { UpdateInventoryDto } from './dto/updateInventory.dto';
import { AssetsService } from 'src/assets/assets.service';
import { Employee } from 'src/employee/schema/employe.schema';
import { CreateNotificationDto } from 'src/notificationsGateway/dto/CreateNotificationDto';
import { NotificationStatus } from 'src/notificationsGateway/notification.schema';
import { NotificationsService } from 'src/notificationsGateway/notifications.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private readonly notificationService: NotificationsService,
    private readonly assetsService: AssetsService,
  ) {}

  async createInventory(
    createInventoryDto: CreateInventoryDto,
  ): Promise<Inventory[]> {
    const foundAsset = await this.assetsService.findName(
      createInventoryDto.assetName,
    );

    if (!foundAsset) {
      Logger.error(`Asset with name ${createInventoryDto.assetName} not found.`,);
      throw new NotFoundException();
    }

    const {
      assetCodes,
      status = InventoryStatus.Available,
      isDeleted = false,
      deleteDate,
    } = createInventoryDto;

    const inventoryEntries = assetCodes.map((code) => ({
      assetID: foundAsset._id,
      employeeDetails: null,
      assignDate: null,
      assetCodes: code,
      status,
      isDeleted,
      deleteDate,
    }));

    return await this.inventoryModel.create(inventoryEntries);
  }
  async findAssetByEmployeeName(employeeDetails: string): Promise<Inventory[]> {
    return this.inventoryModel.find({ employeeDetails: employeeDetails });
  }

  async cleanUpInventories(employeeDetails): Promise<void> {
    const deletedEmployees = await this.inventoryModel.find({
      employeeDetails: employeeDetails,
    });

    for (const delEmployee of deletedEmployees) {
      await this.unassignFromEmployee(delEmployee._id.toString());
    }
  }

  async assignToEmployee(
    inventoryID: string,
    employeeDetails: string,
    assignDate: string,
  ): Promise<Inventory> {
    const foundEmployee = await this.employeeModel.findById(employeeDetails);

    if (!foundEmployee) {
      throw new NotFoundException(
        `Employee with ID ${employeeDetails} not found`,
      );
    }

    await this.inventoryModel.findByIdAndUpdate(inventoryID, {
      employeeDetails: foundEmployee._id,
      assignDate: new Date(assignDate),
      status: InventoryStatus.Assigned,
    });

    const assignedInventory = await this.inventoryModel
      .findById(inventoryID)
      .populate('employeeDetails');

    const createNotificationDto: CreateNotificationDto = {
      message: `You have been assigned an asset: ${assignedInventory.assetName}`,
      isRead: false,
      userId: foundEmployee._id as unknown as Types.ObjectId,
      path: `/company/assets`,
      status: NotificationStatus.NOTIFICATION,
    };

    try {
      const notification = await this.notificationService.createNotification(
        createNotificationDto,
      );
      console.log('Notification sent to employee:', notification);
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    return assignedInventory;
  }

  async unassignFromEmployee(inventoryID: string): Promise<Inventory> {
    const foundInventory = await this.inventoryModel.findById(inventoryID);

    if (!foundInventory) {
      throw new NotFoundException(
        `Inventory item with ID ${inventoryID} not found`,
      );
    }

    foundInventory.employeeDetails = null;
    foundInventory.status = InventoryStatus.Available;
    foundInventory.assignDate = null;

    const updatedInventory = await foundInventory.save();
    const response = {
      ...updatedInventory.toObject(),
      employeeDetails: updatedInventory.employeeDetails,
    };
    return response as unknown as Inventory;
  }

  async repairAsset(inventoryID: string): Promise<Inventory> {
    const inventoryToRepair = await this.unassignFromEmployee(inventoryID);

    inventoryToRepair.status = InventoryStatus.OnRepair;

    return inventoryToRepair;
  }

  async delete(id: string): Promise<Inventory> {
    const deletedInventory = await this.inventoryModel.findByIdAndDelete(id);

    if (!deletedInventory) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    return deletedInventory;
  }

  async softDeleteAssetById(id: string): Promise<Inventory> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return this.inventoryModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deleteDate: currentDate },
        { new: true },
      )
      .exec();
  }

  async updateInventory(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    if (updateInventoryDto.status === InventoryStatus.OnRepair) {
      return await this.repairAsset(id);
    }
    return this.inventoryModel
      .findByIdAndUpdate(id, updateInventoryDto, { new: true })
      .exec();
  }
}
