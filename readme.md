# Alerts Pusher

Run some code periodically in order to get alerts if certain conditions are met.

### For example:

Check for local tornado watches and warnings every minute (when out of town). If any exist, send a discord alert.

Scrape a website every x time and get an alert if conditions meet.

## Directions:

For existing alert code, adjust `src/start.ts` to desired interval and length of time to call the desired function.

For new alerts, create a folder in `src` exposing a top level function to call, then repeat above.

Can schedule multiple alerts.

Starting in prod:

```
# start via pm2
$ pm2 start npm --name "alerts-pusher" -- start
# stream logs
$ pm2 logs

# or just
$ npm start
```

## Future:

Currently only utilizing discord message alerts.

Can also implement texting, calling, and/or emailing alerts, depending on particular alert needs.
