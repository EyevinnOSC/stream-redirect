# Stream Redirect Web Runner

Deploy this as a [Web Runner](https://app.osaas.io/dashboard/service/eyevinn-web-runner) and you have a stream redirector that is configurable using the [application config service](https://app.osaas.io/dashboard/service/eyevinn-app-config-svc).

## Prerequisites

- An account in Eyevinn Open Source Cloud with 2 services available in the plan.

## Get started

1. Fork this repository.
2. Deploy the forked repository as a Web Runner in Eyevinn OSC. See [Web Runner documentation](https://docs.osaas.io/osaas.wiki/Service%3A-Web-Runner.html) for instructions.
3. Go to [Application Config Service](https://app.osaas.io/dashboard/service/eyevinn-app-config-svc) and click on the instance called `streamredirector`
4. Enter a name of your stream, e.g. `oscdemo` and a URL to the stream

Obtain the URL to your web runner instance and open the URL `https://<webrunner>/play/oscdemo` and it will redirect and play the URL specified in the configuration.


