import { Routes } from '@angular/router';
import { LoginComponent } from './features/admin/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { HomeLayoutComponent } from './core/layouts/home-layout/home-layout.component';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';
import { HeroComponent } from './features/home/hero/hero.component';
import { SearchResultsComponent } from './features/home/search-results/search-results.component';
import { adminGuard, customerGuard } from './guards/admin.guard';
import { HotelDetailsComponent } from './features/home/hotel-details/hotel-details.component';
import { PaymentCheckoutComponent } from './features/home/payment-checkout/payment-checkout.component';
import { ManageHotelsComponent } from './features/admin/dashboard/components/manage-hotels/manage-hotels.component';
import { ManageEmployeesComponent } from './features/admin/dashboard/components/manage-employees/manage-employees.component';
import { UserLoginComponent } from './features/home/user-login/user-login.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeLayoutComponent,
        children:[
            {path:'',component:HeroComponent},
            {path:'search',component:SearchResultsComponent},
            {path:'hotel',component:HotelDetailsComponent},
            {path:'payments/checkout',component:PaymentCheckoutComponent,canActivate:[customerGuard]},
            {path:'login',component: UserLoginComponent}
            {path:'',component:}
        ]
    },
    {
        path:'admin/login',
        component:LoginComponent
    },
    {
        path:'admin',
        component:AdminLayoutComponent,
        children:[
            {path:'dashboard',component:DashboardComponent},
            {path:'manage-hotels',component:ManageHotelsComponent},
            {path:'manage-employees',component:ManageEmployeesComponent},
        ],
        canActivate: [adminGuard]
    },
    {
        path:'**',
        redirectTo:''
    }
];
