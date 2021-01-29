import { OrderStatus } from '@bc_tickets/common';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('marks an order as cancelled', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.signup();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Make request to cancel the order
  const { body: updatedOrder } = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);

  // Expect the order is cancelled
  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an order cancelled event');
