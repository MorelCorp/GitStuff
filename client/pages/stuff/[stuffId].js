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
      <div class="card" style={{ width: 18 + 'rem' }}>
        <div class="card-body">
          <h5 class="card-title">{stuff.title}</h5>
          <h6 class="card-subtitle">Price: {stuff.price}</h6>
          <p class="card-text">{stuff.description}</p>
          <button onClick={() => doRequest()} className="btn btn-primary">
            Purchase
          </button>
        </div>
      </div>
      {errors}
    </div>
  );
};

StuffShow.getInitialProps = async (context, client) => {
  const { stuffId } = context.query;

  const { data } = await client.get(`/api/stuff/${stuffId}`);

  return { stuff: data };
};

export default StuffShow;
