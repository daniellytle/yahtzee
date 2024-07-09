import { NaivePlayer } from "./players/naivePlayer";
import { Runner } from "./runner";


describe('runner', () => {
  test('Should play game', () => {
    const score = Runner.play(new NaivePlayer())
  });
});