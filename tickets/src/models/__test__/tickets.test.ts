import { Ticket } from '../tickets'

it('implements optimistic concurrency control ', async (done) => {

  const ticket = await Ticket.create({
    title: 'concert',
    price: 6,
    userId: '12345'
  })

  const firstInstance = await Ticket.findById(ticket.id)

  const secondInstance = await Ticket.findById(ticket.id)
  //
  await firstInstance!.set({ price: 10 }).save()

  try {
    await secondInstance!.set({ price: 15 }).save()
  } catch (err) {
    return done()
  }

  throw new Error('Should not reach this point ')


})

it('increments the version number on multiples saves ', async () => {

  const ticket = await Ticket.create({
    title: 'concert',
    price: 20,
    userId: '123235'
  })

  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)


})
