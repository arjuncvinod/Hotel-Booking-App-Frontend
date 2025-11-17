import { Routes } from '@angular/router';
import { LoginComponent } from './features/admin/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { HomeLayoutComponent } from './core/layouts/home-layout/home-layout.component';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';
import { HeroComponent } from './features/home/hero/hero.component';
import { SearchResultsComponent } from './features/home/search-results/search-results.component';
import { adminGuard } from './guards/admin.guard';
import { HotelDetailsComponent } from './features/home/hotel-details/hotel-details.component';
import { PaymentCheckoutComponent } from './features/home/payment-checkout/payment-checkout.component';
import { ManageHotelsComponent } from './features/admin/dashboard/components/manage-hotels/manage-hotels.component';
import { ManageEmployeesComponent } from './features/admin/dashboard/components/manage-employees/manage-employees.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeLayoutComponent,
        children:[
            {path:'',component:HeroComponent},
            {path:'search',component:SearchResultsComponent},
            {path:'hotel',component:HotelDetailsComponent},
            {path:'payments/checkout',component:PaymentCheckoutComponent},
            {path:'login',component: LoginComponent}
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
