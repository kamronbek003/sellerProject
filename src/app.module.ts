import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module'; 
import { SellerModule } from './modules/seller/seller.module';
import { CustomerModule } from './modules/customer/customer.module';
import { OrderModule } from './modules/order/order.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { OrderItemModule } from './modules/order-item/order-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    PrismaModule,
    AuthModule,
    SellerModule,
    CustomerModule,
    OrderModule,
    CategoryModule,
    ProductModule,
    OrderItemModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}