import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    // console.log(req.headers);

    // console.log("[+] In Server");

    // NOTE: http://SERVICE_NAME.NAMESPACE.svc.cluster.local
    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
      // headers: {
      //   Host: "ticketing.dev",
      // },
    });
  } else {
    // console.log("[+] In Browser");
    return axios.create({ baseURL: "/" });
  }
};

export default buildClient;
