import { Stuff } from '../stuff';

it('implements optimistic concurrency control', async (done) => {
  //create an instance of a stuff
  const stuff = Stuff.build({
    title: 'concert',
    price: 5,
    userId: '123',
    description: '',
  });

  // save the stuff to the db
  await stuff.save();

  // fetch the stuff twice
  const firstInstance = await Stuff.findById(stuff.id);
  const secondInstance = await Stuff.findById(stuff.id);

  // make two separate changes to the stuff we fetched
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  // save the first fetched stuff
  await firstInstance?.save();

  // save the second fetchet stuff and we want this to fail
  try {
    await secondInstance?.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const stuff = Stuff.build({
    title: 'concert',
    price: 20,
    description: 'Musical much!',
    userId: '123',
  });
  await stuff.save();
  expect(stuff.version).toEqual(0);
  await stuff.save();
  expect(stuff.version).toEqual(1);
  await stuff.save();
  expect(stuff.version).toEqual(2);
});
