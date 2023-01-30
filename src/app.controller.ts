import { Controller, Request, Post, Get, UseGuards, Body, BadRequestException,Query, Param,Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { ERole } from './auth/role.enum';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { SignUpDto } from './auth/signup.dto';
import { CommsService } from './comms/comms.service';
import { UsersService } from './users/users.service';
import { MarketplaceService } from './marketplace/marketplace.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
     private authService: AuthService, 
     private userService: UsersService, 
     private commsService: CommsService,
     private marketplaceService: MarketplaceService,
     ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('api/login')
  async login(@Request() req) {
    let token ='';
    if (!req.user.is_user_verified){
      await this.commsService.initiatePhoneNumberVerification(req.user.contact_number);
      return {success: true}
    }
    return {token : req.user, success: true};
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('api/auth/verifyOTP')
  // async verifyOTP(@Request() req) {
  //   return await this.authService.get_access_token(req.user);
  // }

  @Post('api/auth/signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/profile')
  async getProfile(@Request() req) {
    const user = await this.userService.getProfile(req.user.contact_number);
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.Admin)
  @Post('api/addProvider')
  async addProvider(@Request() req: any)  {
    let resp =  await this.marketplaceService.addProvider(req.body,req.user);
    return resp;
  }
  @UseGuards(JwtAuthGuard)
  @Get('api/getProviders')
  async getProviderList(@Request() req: any)  {
    let resp =  await this.marketplaceService.getProviders();
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/getAvailableProducts')
  async getProducts(@Query('providerid') providerid: number) {
  let resp = await this.marketplaceService.getItemsForProvider(+providerid);
  return resp;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.User)
  @Post('api/createOrder/:itemId')
  async createOrder(@Param() params: any, @Request() req: any)  {
    let resp =  await this.marketplaceService.createOrder(params,req.user);
    return resp;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.User)
  @Get('api/itemDetails/:id')
  async getItemDetails(@Param() params: any)  {
    let resp =  await this.marketplaceService.getItemDetails(+params.id);
    return resp;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.User)
  @Get('api/getOrderDetails')
  async getOrderDetailsForUser(@Request() req: any)  {
    let resp =  await this.marketplaceService.getOrdersForUser(+req.user.userId);
    return resp;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.User)
  @Get('api/getQuote/:orderId')
  async markOrderComplete(@Param() params: any)  {
    let resp =  await this.marketplaceService.fulfillOrder(+params.orderId);
    return resp;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.User)
  @Get('api/getAllFinacials')
  async getAllFinancials(@Request() req: any)  {
    let resp =  await this.marketplaceService.fetchAllActivitiesForUser(+req.user.userId);
    return resp;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.User)
  @Get('/api/getUserDetails/:contact_number')
  async getUserDetails(@Param() param: any)  {
    let resp =  await this.userService.getProfile(param.contact_number);
    return resp;
  }
  // /api/addExpenses
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.User)
  @Post('/api/addExpenses')
  async addExpenses(@Request() req: any)  {
      let resp =  await this.marketplaceService.addActivity(req.body,req.body.userList,req.user);
      return resp;
  }
// /api/settleDue/
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.User)
  @Put('/api/settleDue/:relationId')
  async settleDues(@Param() params: any,@Request() req: any)  {
      let resp =  await this.marketplaceService.settleActivityForUser(+params.relationId,req.param.userId);
      return resp;
  }
  // /api/getUserDetails/${addedUser.contact_number}

}