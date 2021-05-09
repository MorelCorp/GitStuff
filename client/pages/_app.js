import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);

  console.log('**getInitialProps before calling /api/users/currentuser');

  const { data } = await client.get('/api/users/currentuser');

  //calling the getInitialProps for all pages that have one
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
    console.log('**All good for AppComponent Initialization. Returning.');
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
