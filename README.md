![Run Jest Tests](https://github.com/DaniTulp/aanzee-tina-next/workflows/Run%20Jest%20Tests/badge.svg)

# Setup

```
yarn add @danitulp/aanzee-tina-next
```

Add all the peer dependencies.

```
yarn add @directus/sdk-js @tinacms/fields @tinacms/forms @tinacms/react-forms @tinacms/styles react react-dom react-tinacms-editor react-tinacms-inline styled-components tinacms
```

## The goal

The goal of this package is to be able to create a working CMS using [TinaCMS](https://tinacms.org) and [Directus](https://directus.io). Currently we achieve this by adding a component which wraps the React application (optimized for NextJS). When adding this wrapper you get access to React Hooks which make it possible to easily add page editing functionality to your project. The three things it currently does is:

- Authentication management
- Dynamically add form fields based on configuration
- Directus integration

By doing this we can handle some boilerplate configuration while still retaining the flexibility you need.

The setup process below will show how it can be implemented in a NextJS application. Note: this is the way we settled on but you could change the way you implement these.

## NextJS setup

### pages/\_app.js

The `pages/_app.js` file is the wrapper for NextJS applications. In here we can initialize the `Tina` component. We import it dynamically using Next dynamic imports because we don't want to increase the bundle size when not in use, see [this Github issue](https://github.com/tinacms/tinacms/issues/771). This way it only gets loaded when it's needed. In this example we use [Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode) to decide when the `Tina` should be loaded. The `Tina` component requires a prop `options` to know what the url is for the Directus API and which Directus project it is.

**NOTE:** this only works if the page exports a `preview` prop from the [`getStaticProps()`](https://nextjs.org/docs/advanced-features/preview-mode#step-2-update-getstaticprops) function. When you don't expose a `preview` prop from `getStaticProps()` it won't render `Tina` even if it is enabled.

The `PreviewProvider` component isn't required but it exposes a `usePreview()` hook which can be used inside all the nested components.

```jsx
// pages/_app.js

import { PreviewProvider } from "@danitulp/aanzee-tina-next";
import dynamic from "next/dynamic";
const Tina = dynamic(
  async () => (await import("@danitulp/aanzee-tina-next")).Tina
);

function App({ Component, pageProps }) {
  if (pageProps.preview) {
    return (
      <Tina
        options={{
          url: "http://directus-api.test/",
          project: "api",
        }}
      >
        <PreviewProvider value={pageProps.preview}>
          <Component {...pageProps}></Component>
        </PreviewProvider>
      </Tina>
    );
  }
  return (
    <PreviewProvider value={pageProps.preview}>
      <Component {...pageProps}></Component>
    </PreviewProvider>
  );
}

export default App;
```

To enable preview mode reference [this documentation](https://nextjs.org/docs/advanced-features/preview-mode). You could have a custom login page which uses the Directus api to authenticate. You could then validate the token inside the preview mode lambda function. Here's an example of a function you could use to validate the token:

```js
import { createServerClient } from "@danitulp/aanzee-tina-next/";

export default async (req, res) => {
  const token = req.body.token;
  if (!token) {
    res.clearPreviewData();
    return res.status(400).json({
      message: "No token set",
    });
  }
  const client = createServerClient({
    url: "http://directus-api.test/",
    project: "api",
    token: "admin",
  });
  client.config.token = token;

  if (!(await client.isLoggedIn())) {
    res.clearPreviewData();
    return res.status(400).end({
      message: "Invalid token",
    });
  }
  res.setPreviewData({});
  return res.status(200).end();
};
```
Usually the way you want to setup a page is as follows:

```jsx
// pages/index.js
import { usePreview } from "@danitulp/aanzee-tina-next";
import dynamic from "next/dynamic";

const PreviewComponent = dynamic(() => import("./../components/Preview"));
export default function Home({ news }) {
  const preview = usePreview();
  return preview ? (
    <PreviewComponent>Preview</PreviewComponent>
  ) : (
    <div>No Preview</div>
  );
}

export async function getStaticProps(context) {
  const preview = !!context.preview;
  const client = createServerClient({
    url: "http://directus-api.test/",
    project: "api",
    token: "static-token",
  });
  const news = await client.getItems("news", {
    status: !context.preview ? "published" : "*",
  });
  //NOTE if you don't export a preview prop, the provider won't know when it's enabled.
  return {
    props: {
      news,
      preview,
    },
  };
}
```

First of all we add another dynamic import for the preview component, this is again so we don't load all of the dependencies when they are not needed. Based on the value of the `usePreview` hook we can check whether it's in preview mode (**This requires the `PreviewProvider` to work**).

In the `getStaticProps` method we check if the preview mode is enabled and we create a [Directus Client](https://docs.directus.io/guides/js-sdk.html) for the serverside code. Because the serverside client doesn't handle authentication we have to give it a [static token](https://docs.directus.io/api/authentication.html#tokens), this should be kept secret from the client. Based on if the preview mode is enabled we can manipulate the client to only show all published news posts or all the news post for example. In the `Home` function we then have access to all the variables that are defined in the `props` object. In this case don't actually need the `news` object but you could render a list of news items.

Inside the `PreviewComponent` is where the logic lives to interact with TinaCMS.

```jsx
//components/preview.js
import {
  AbstractField,
  useDirectusFields,
  useDirectusClient,
} from "@danitulp/aanzee-tina-next";
import { useForm, usePlugin } from "tinacms";

export default function ({ children }) {
  const client = useDirectusClient();
  const fields = useDirectusFields("news", {
    customFields: {
      switch: ToggleField,
    },
  });
  const [values, form] = useForm(
    {
      onSubmit: async (values) => await client.createItem("news", values),
      fields,
      label: "Create news item",
      id: "add-news",
    },
    {
      fields,
    }
  );
  usePlugin(form);
  return <>{children}</>;
}

class ToggleField extends AbstractField {
  map() {
    this.tinaField.component = "toggle";
    return this.tinaField;
  }
}
```

In the `PreviewComponent` we use the `useDirectusFields` hook we pass in an argument which represents a Directus collection, in this case "news". We use the collection to retrieve the field definition defined in Directus. This returns an array of fields which can be used by TinaCMS. Not all interfaces defined by Directus are currently implemented yet, things like text inputs, textarea and wysiwyg fields are defined by default. You can override these or add new ones too. In this case we add a custom field "switch" which expects a class that extends the `AbstractField` class. In this case [toggle](https://tinacms.org/docs/fields/toggle) is already defined inside TinaCMS, if you want to add your own [Custom Field reading this part of the TinaCMS documentation can be referenced](https://tinacms.org/docs/fields/custom-fields). When a field isn't defined it will show a warning in the console and in the sidebar it will render "Unrecognized field type".

The `useForm` hook is provided by TinaCMS, for a full reference check [this link](https://tinacms.org/docs/forms#form-configuration). We add the fields we just got back from the `useDirectusFields` hook. We also add it to the second argument because the fields are fetched asynchronously and this argument watches for changes. The `onSubmit` handler defines what happens when the form gets submitted. In this case we create a news item when the form is submitted. We get a directus client by using the `useDirectusClient` hook. **NOTE: all of these hooks have to be inside the Tina component defined in the `_app.js` file.**

## Problems

I don't really like the way we have to check on each page that uses the CMS if the preview is enabled, but currently this solution offers you the most flexbility. You could potentially add your own abstractions on top of these. I don't know if there is a generic way to do it. When the TinaCMS package gets the bundle sizes under control it could be less of a problem.

I'm also not loving the current way to override the custom fields I feel like a class is to heavy, it might be beter to just be able to pass in a closure with all the properties you might need.
