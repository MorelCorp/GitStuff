import Link from 'next/link';

const LandingPage = ({ currentUser, stuff }) => {
  const stuffList = stuff.map((stuff) => {
    return (
      <tr key={stuff.id}>
        <td>{stuff.title}</td>
        <td>{stuff.price}</td>
        <td>
          <Link href="/stuff/[stuffId]" as={`/stuff/${stuff.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2>Stuff</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{stuffList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/stuff');
  return { stuff: data };
};

export default LandingPage;
