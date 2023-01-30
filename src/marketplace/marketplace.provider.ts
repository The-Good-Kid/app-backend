import { DataSource } from 'typeorm';
import { Item } from './entity/item.entity';
import { Provider } from './entity/provider.entity';
import { Order } from './entity/order.entity';
import { Activity } from './entity/activity.entity';
import { UserActivityRelation } from './entity/userActivityRelation.entity';

export const marketplaceProviders = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: ['DATA_SOURCE'],
  },
    {
    provide: 'ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Item),
    inject: ['DATA_SOURCE'],
    },
    {
    provide: 'PROVIDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Provider),
    inject: ['DATA_SOURCE'],
    },
    {
    provide: 'ACTIVITY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Activity),
    inject: ['DATA_SOURCE'],
    },
    {
    provide: 'USER_ACTIVITY_RELATIONS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserActivityRelation),
    inject: ['DATA_SOURCE'],
    }
];