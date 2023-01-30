import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './entity/item.entity';
import { Provider } from './entity/provider.entity';
import { Order } from './entity/order.entity';
import { User } from 'src/users/user.entity';
import { Activity } from './entity/activity.entity';
import { UserActivityRelation } from './entity/userActivityRelation.entity';

@Injectable()
export class MarketplaceService {
    constructor(
        @Inject('PROVIDER_REPOSITORY')
        private providerRepository: Repository<Provider>,
        @Inject('ORDER_REPOSITORY')
        private orderRepository: Repository<Order>,
        @Inject('ITEM_REPOSITORY')
        private itemRepository: Repository<Item>,
        @Inject('ACTIVITY_REPOSITORY')
        private activityRepository: Repository<Activity>,
        @Inject('USER_ACTIVITY_RELATIONS_REPOSITORY')
        private userActivityRelationsRepository: Repository<UserActivityRelation>,

    ) { }
    async addItem(item: any, user: any) {
        let itemEntity = new Item();
        itemEntity.name = item.item_name;
        itemEntity.description = item.description;
        itemEntity.price = item.hourly_rate;
        itemEntity.createdAt = new Date();
        itemEntity.updatedAt = new Date();
        itemEntity.createdBy = user.userId;
        itemEntity.provider = new Provider();
        itemEntity.provider = item.provider_id;
        itemEntity.isActive = true;
        itemEntity.type = 'Vehicle';
        itemEntity.uniqueId = item.registration_number;
        return await this.itemRepository.save(itemEntity);
    }
    async deleteItem(id: number) {
        let item = await this.itemRepository.findOne({ where: { id: id } });
        item.isActive = false;
        item.deletedAt = new Date();
        return await this.itemRepository.save(item);
    }
    async createOrder(order: any, user: any) {
        let item = await this.itemRepository.findOne({ where: { id: order.itemId, isActive: true } });
        if (!item) {
            throw new Error('Item not available');
        }
        item.isActive = false;
        await this.itemRepository.save(item);
        let orderEntity = new Order();
        orderEntity.createdBy = user.userId;
        orderEntity.amount = item.price;
        orderEntity.orderInfo = "rental";
        orderEntity.orderType = "vehicle";
        orderEntity.createdAt = new Date();
        orderEntity.updatedAt = new Date();
        orderEntity.items = new Array<Item>();
        orderEntity.items.push(item);
        let resp = await this.orderRepository.save(orderEntity);
        return resp;
    }
    async fulfillOrder(id: number) {
        let order = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .where('order.id = :id', { id: id })
            .getOne();

        if (!order) {
            throw new Error(`Order with id ${id} not found.`);
        }

        order.fulfilledAt = new Date();
        for (let item of order.items) {
            item.isActive = true;
            order.amount = Number(order.amount) + Number(item.price) * ((Number(order.fulfilledAt.getTime()) - Number(order.createdAt.getTime())) / 3600000);
            await this.itemRepository.save(item);
        }
        delete order.items;
        return await this.orderRepository.save(order);
    }


    async addProvider(providerDetails: any, user: any) {
        let provider = new Provider();
        provider.providerName = providerDetails.provider_name;
        provider.meta = JSON.stringify(providerDetails);
        provider.address = providerDetails.address;
        provider.pincode = providerDetails.pincode;
        provider.contactNumber = providerDetails.contact_number;
        provider.createdAt = new Date();
        provider.updatedAt = new Date();
        return await this.providerRepository.save(provider);
    }

    async getOrdersForUser(userId: number) {
        let orders = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .where('order.createdBy = :userId', { userId: userId })
            .getMany();
        let activeOrders = [];
        let pastOrders = [];
        for (let order of orders) {
            if (order.fulfilledAt) {
                pastOrders.push(order);
            } else {
                activeOrders.push(order);
            }
        }
        return { activeOrders: activeOrders, pastOrders: pastOrders };
    }

    async getProviders() {
        return await this.providerRepository.find();
    }

    async getItemsForProvider(providerId: number) {
        let pro = new Provider();
        pro.id = providerId;
        return await this.itemRepository.find({ where: { provider: { id: providerId } } });
    }

    async getItemDetails(id: number) {
        //fetch providers too
        let items = await this.itemRepository
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.provider', 'provider')
            .where('item.id = :id', { id: id })
            .getOne();
        return items;
    }
    async fetchAllActivitiesForUser(userId: number) {
        //find all useractivityrelations and acitivities for this user
        let activities = await this.userActivityRelationsRepository
            .createQueryBuilder('user_activity_relations')
            .leftJoinAndSelect('user_activity_relations.activity', 'activity', 'activity.id = user_activity_relations.activity')
            .leftJoinAndSelect('user_activity_relations.user', 'user', 'user.id = user_activity_relations.user')
            .where('user.id = :userId', { userId: userId })
            .getMany();

        let settled = [];
        let dues = [];
        for (let activity of activities) {
            if (activity.is_settled) {
                settled.push(activity);
            } else {
                dues.push(activity);
            }
        }
        return { settled: settled, dues: dues };
    }
    async fetchActivityDetails(id: number) {
        let activity = await this.activityRepository
            .createQueryBuilder('activity')
            .leftJoinAndSelect('activity.userActivityRelations', 'userActivityRelations')
            .leftJoinAndSelect('userActivityRelations.user', 'user')
            .where('activity.id = :id', { id: id })
            .getOne();
        return activity;
    }
    async addActivity(activity: any, activityRelations: any, user: any) {
        let activityEntity = new Activity();
        activityEntity.activity_name = activity.activityName;
        activityEntity.description = activity.activityDescription;
        activityEntity.created_at = new Date();
        activityEntity.updated_at = new Date();
        activityEntity.is_settled = false;
        activityEntity.total_amount = activity.totalAmount;
        activityEntity.created_by = user.userId
        let data = await this.activityRepository.save(activityEntity)
        for (let relation of activityRelations) {
            let relationEntity = new UserActivityRelation();
            relationEntity.user = new User();
            relationEntity.user.id = relation.userId;
            relationEntity.activity = new Activity();
            relationEntity.activity.id = data.id;
            relationEntity.created_at = new Date();
            relationEntity.updated_at = new Date();
            relationEntity.is_settled = false;
            relationEntity.amount_contributed = Number(relation.contribution);
            await this.userActivityRelationsRepository.save(relationEntity);
        }
        return { success: true };
    }
    async settleActivityForUser(activityId: number, userId: number) {
        let relation = await this.userActivityRelationsRepository.findOne({ where: { id: activityId }, relations: ['user', 'activity'] });
        let is_activity_settled = true;
        let parent_id = relation.activity.id;
        if (!relation.is_settled) {
            relation.is_settled = true;
            relation.settled_at = new Date();
            await this.userActivityRelationsRepository.save(relation);
            let relations = await this.userActivityRelationsRepository.find({ where: { activity: { id: parent_id } } });
            for (let rel of relations) {
                if (!rel.is_settled) {
                    is_activity_settled = false;
                }
            }
            if (is_activity_settled) {
                let activity = await this.activityRepository.findOne({ where: { id: activityId } });
                activity.is_settled = true;
                await this.activityRepository.save(activity);
            }
        }
        return { success: true };

    }
}
