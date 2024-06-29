# Starting Instructions

1. Open Terminal
2. In Terminal, go to the base directory i.e, **2-ticketing-app**, run `skaffold dev`
3. Wait for everything to build and deploy (This may take a while)
4. Verify the docker images
5. to check the logs

   `kubectl get pods`

   `kubectl logs --follow <pod_name>`

### Points to note

---

Here you have build a npm common module that you need to install in every service
it's `@debirapid-ticket/common`

---

## Steps to add a new service

![create new image](./z-resources/create-new-service.png)
