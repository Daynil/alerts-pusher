import { mocked } from 'jest-mock';
import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { baseUrl, clearStaleAlerts, getCurrentLocalAlerts } from '..';
import { sendDiscordMessage } from '../../services/discord-service';
import alerts from './fixtures/alerts.json';

jest.mock('../../services/discord-service.ts');
const mockedSendDiscordMessage = mocked(sendDiscordMessage);

let server: SetupServerApi = null;

beforeAll(async () => {
  await clearStaleAlerts();

  server = setupServer();

  server.listen();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  server.close();
  await clearStaleAlerts();
});

test('weather alerts are properly reported', async () => {
  // First, we retrieve a Tornado Watch only
  server.use(
    rest.get(`${baseUrl}/alerts/active`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(alerts.tornado_watch_only));
    })
  );
  await getCurrentLocalAlerts();
  expect(mockedSendDiscordMessage).toHaveBeenCalledTimes(1);
  expect(mockedSendDiscordMessage).toHaveBeenCalledWith(
    expect.stringMatching(/tornado watch/i)
  );

  // Next, we retrieve the same watch, and also a Tornado Warning
  server.resetHandlers(
    rest.get(`${baseUrl}/alerts/active`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(alerts.tornado_watch_warning1));
    })
  );
  mockedSendDiscordMessage.mockClear();
  await getCurrentLocalAlerts();
  // The Watch is cached now, so it no longer triggers a message
  expect(mockedSendDiscordMessage).toHaveBeenCalledTimes(1);
  // The Warning is the only message trigger now
  expect(mockedSendDiscordMessage).toHaveBeenCalledWith(
    expect.stringMatching(/tornado warning/i)
  );

  // Next, we retrieve the same watch, and a new Tornado Warning
  server.resetHandlers(
    rest.get(`${baseUrl}/alerts/active`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(alerts.tornado_watch_warning2));
    })
  );
  mockedSendDiscordMessage.mockClear();
  await getCurrentLocalAlerts();
  expect(mockedSendDiscordMessage).toHaveBeenCalledTimes(1);
  // The Warning is still the only message trigger
  expect(mockedSendDiscordMessage).toHaveBeenCalledWith(
    expect.stringMatching(/tornado warning/i)
  );

  // Same alert repeated, should now be stale
  mockedSendDiscordMessage.mockClear();
  await getCurrentLocalAlerts();
  expect(mockedSendDiscordMessage).not.toHaveBeenCalled();

  // Finally, if cache is clear and we get a watch and a warning
  // We get a message containing both
  await clearStaleAlerts();
  mockedSendDiscordMessage.mockClear();
  await getCurrentLocalAlerts();
  expect(mockedSendDiscordMessage).toHaveBeenCalledTimes(1);
  expect(mockedSendDiscordMessage).toHaveBeenCalledWith(
    expect.stringMatching(/tornado watch/i) &&
      expect.stringMatching(/tornado warning/i)
  );

  await clearStaleAlerts();
});
