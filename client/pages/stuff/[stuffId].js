import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const StuffShow = ({ stuff }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      stuffId: stuff.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{stuff.title}</h1>
      <h4>Price: {stuff.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

StuffShow.getInitialProps = async (context, client) => {
  const { stuffId } = context.query;

  const { data } = await client.get(`/api/stuff/${stuffId}`);

  return { stuff: data };
};

export default StuffShow;
