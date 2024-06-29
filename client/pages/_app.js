import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      {/* <h1>Header {currentUser.email}</h1> */}
      <Header currentUser={currentUser} />

      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

/* NOTE: 
  - If getInitialProps is added to AppComponent, then the getInitialProps added to other pages like Landing page in index.js will not be called automatically

  - Ergo, you will have to manually invoke them
*/
AppComponent.getInitialProps = async (appContext) => {
  // console.log(Object.keys(appContext));
  // console.log(appContext);

  const client = buildClient(appContext.ctx);

  const { data } = await client.get("/api/users/me");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }

  // console.log(data);
  // console.log(pageProps);

  return { pageProps, currentUser: data.data };
};

export default AppComponent;
