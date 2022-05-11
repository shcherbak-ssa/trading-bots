# Trading Bots #


## Database ##

Filename template:

```dotenv
# server/api/database/
[database_name]-[collection_name].ts
```

## Position calculations ##

> For `SHORT` position add `market spread` to `Stop Loss price`.
> It because we use `bid price` for strategy and calculations.

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

### Quantity ###

```dotenv
close_commission = stop_loss_price * commission / 100
total_commission = close_commission + open_commission

risk = quantity * SLs + Ps * open_commission + Ps * close_commission
risk = quantity * ( SLs + total_commission )

# If result position amount less than total capital amount
quantity = risk / ( SLs + total_commission )

# else
quantity = ( capital * leverage - quantity * open_commission - quantity * close_commission ) / open_price
quantity = capital * leverage / ( open_price + total_commission )
```

### Take profit ###

> Take profit price => `TPp`   
> Take profit size => `TPs`  
> Profit/Loss => `pl`

```dotenv
TPp = open_price + TPs  # For LONG position
TPp = open_price - TPs  # For SHORT position

close_commission = ( open_price +- TPs ) * commission / 100

profit = TPs * quantity || pl * risk + quantity * open_commission + quantity * close_commission

TPs * Ps = pl * risk + quantity * ( open_commission + close_commission )
TPs - 2 * open_price * commission / 100 -+ TPs * commission / 100 = pl * risk / quantity
TPs * ( 1 -+ commission / 100 ) = ( pl * risk / quantity ) + 2 * open_commission

# For LONG position
TPs = ( ( pl * risk / quantity ) + 2 * open_commission ) / ( 1 - commission / 100 )

# For SHORT position
TPs = ( ( pl * risk / quantity ) + 2 * open_commission ) / ( 1 + commission / 100 )
```
