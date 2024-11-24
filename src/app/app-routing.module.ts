import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MarketDataComponent } from './market/market-data/market-data.component';
import { WalletComponent } from './wallet/wallet.component';
import { AuthGuard } from './auth/auth.guard';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';
import { ProfileComponent } from './profile/profile.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { BlockComponent } from './blocks/block/block.component';
import { TradeDetailComponent } from './trades/trade-detail/trade-detail.component';
import { BlockDetailComponent } from './blocks/block-detail/block-detail.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/market', pathMatch: 'full' },
  { path: 'market', component: MarketDataComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserDetailComponent },
  {
    path: 'trade/:currency',
    component: CurrencyConverterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'trade/detail/:id',
    component: TradeDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: 'wallet', component: WalletComponent, canActivate: [AuthGuard] },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    canActivate: [AuthGuard],
  },
  { path: 'blocks', component: BlockComponent },
  { path: 'blocks/:id', component: BlockDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
