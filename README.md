# Trading Bots #


## Bot ##

Bot `token` field template:
```dotenv
[user_id]-[bot_id]
```

## Database ##

Filename template:

```dotenv
# server/api/database/
[database_name]-[collection_name].ts
```

## Position calculations ##

> For `SHORT` position add `market spread` to `stop-loss price`.
> It because we use `big price` for strategy and calculations.

### Common ###

```dotenv
# Stop-loss price for SHORT
stop_loss_price = stop_loss_price + spread

# Open price
open_price = current_price + is_long ? spread : 0

# Open commission (OC)
open_commission = open_price * commission / 100
```

### Stop loss size (SLs) ###

```dotenv
# For LONG position
SLs = open_price - stop_loss_price

# For SHORT position
SLs = stop_loss_price - open_price
```

### Position size (Ps) ###

```dotenv
close_commission = stop_loss_price * commission / 100
total_commission = close_commission + open_commission

risk = Ps * SLs + Ps * open_commission + Ps * close_commission
risk = Ps * ( SLs + total_commission )

# If result position amount less than total capital amount
Ps = risk / ( SLs + total_commission )

# else
Ps = ( capital * leverage - Ps * open_commission - Ps * close_commission ) / open_price
Ps = capital * leverage / ( open_price + total_commission )
```

### Take profit ###

> Take profit price => `TPp`   
> Take profit size => `TPs`  
> Take profit profit/loss => `pl`

```dotenv
TPp = open_price + TPs  # For LONG position
TPp = open_price - TPs  # For SHORT position

close_commission = ( open_price +- TPs ) * commission / 100

profit = TPs * Ps || pl * risk + Ps * open_commission + Ps * close_commission

TPs * Ps = pl * risk + Ps * ( open_commission + close_commission )
TPs - 2 * open_price * commission / 100 -+ TPs * commission / 100 = pl * risk / Ps
TPs * ( 1 -+ commission / 100 ) = ( pl * risk / Ps ) + 2 * open_commission

# For LONG position
TPs = ( ( pl * risk / Ps ) + 2 * open_commission ) / ( 1 - commission / 100 )

# For SHORT position
TPs = ( ( pl * risk / Ps ) + 2 * open_commission ) / ( 1 + commission / 100 )
```
