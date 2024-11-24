import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './UI/header/header.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { CurrencyComponent } from './market/currency/currency.component';
import { HttpClientModule } from '@angular/common/http';
import { MarketSummaryComponent } from './market/market-summary/market-summary.component';
import { MarketDataComponent } from './market/market-data/market-data.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { WalletComponent } from './wallet/wallet.component';
import { DepositModalComponent } from './modal/deposit-modal/deposit-modal.component';
import { WithdrawalModalComponent } from './modal/withdrawal-modal/withdrawal-modal.component';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';
import { TransferModalComponent } from './modal/transfer-modal/transfer-modal.component';
import { TradeHistoryComponent } from './trades/trade-history/trade-history.component';
import { TradeComponent } from './trades/trade/trade.component';
import { ProfileComponent } from './profile/profile.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { BlockComponent } from './blocks/block/block.component';
import { TradeDetailComponent } from './trades/trade-detail/trade-detail.component';
import { BlockDetailComponent } from './blocks/block-detail/block-detail.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PaginationComponent } from './pagination/pagination.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    CurrencyComponent,
    MarketSummaryComponent,
    MarketDataComponent,
    TransactionHistoryComponent,
    WalletComponent,
    DepositModalComponent,
    WithdrawalModalComponent,
    CurrencyConverterComponent,
    TransferModalComponent,
    TradeHistoryComponent,
    TradeComponent,
    ProfileComponent,
    WatchlistComponent,
    BlockComponent,
    TradeDetailComponent,
    BlockDetailComponent,
    LeaderboardComponent,
    PaginationComponent,
    UserDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
