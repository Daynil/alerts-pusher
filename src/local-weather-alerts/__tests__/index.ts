import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { mocked } from 'ts-jest/utils';
import { baseUrl, clearStaleAlerts, getCurrentLocalAlerts } from '..';
import { sendDiscordMessage } from '../../services/discord-service';
import { parseJSONFile } from '../../services/json-service';
import { WeatherResponse } from '../../util/api';

jest.mock('../../services/discord-service.ts');
const mockedSendDiscordMessage = mocked(sendDiscordMessage);

let server: SetupServerApi = null;
let tornadoWatchOnly: WeatherResponse = null;

beforeAll(async () => {
  await clearStaleAlerts();
  tornadoWatchOnly = await parseJSONFile<WeatherResponse>(
    require.resolve('./fixtures/tornado_watch.json')
  );

  server = setupServer(
    rest.get(`${baseUrl}/alerts/active`, (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(tornadoWatchOnly));
    }),
    rest.get(`${baseUrl}/alerts/active`, (req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(tornadoWatchOnly));
    })
  );

  server.listen();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => server.close());

test('weather alerts are properly reported', async () => {
  await getCurrentLocalAlerts();
  expect(mockedSendDiscordMessage).toHaveBeenCalledTimes(1);
  expect(mockedSendDiscordMessage).toHaveBeenCalledWith(
    expect.stringContaining(tornadoWatchOnly.features[0].properties.headline)
  );

  // Same alert repeated, should now be stale
  mockedSendDiscordMessage.mockClear();
  await getCurrentLocalAlerts();
  expect(mockedSendDiscordMessage).not.toHaveBeenCalled();

  await clearStaleAlerts();
});
