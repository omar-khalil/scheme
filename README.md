# scheme
A TypeScript library for creating schemas easily. Provides type-safety and run-time type validation for API endpoints, as well as ready-to-use functions for the server and client.

## Usage Instructions
> Note: This process will be simplified in the future. Scheme will automatically generate these contracts using GitHub Actions and can be imported as an npm package instead of directly via a repository.

### Step 1: Fork this repository
Fork the Scheme repository into a new repository in your GitHub account. This will allow you to customize the endpoints for your application.

### Step 2: Define your endpoints
Define the schema for your endpoints in the `src/endpoints.ts` file. Example:
```typescript
get_user: {
    url: "/user",
    type: "get",
    schema: {
      params: s.string_record({
        user_id: s.str(),
      }),
      responses: [
        {status: 200, data: objects.user},
        {status: 404, data: s.obj({message: s.str()})},
      ]
    }
  }
```
> An example schema is already provided in `src/endpoints.ts`, which you can delete and overwrite with your own endpoints. 


>`objects.user` here is a reusable data type defined in the `src/objects.ts` file, which you can also replace with your own object schemas.

### Step 3: Generate contracts
Run the following script to generate the Typescript contracts, which will be `d.ts` files containing types derived from your schema.

```shell
yarn generate_contracts
```
Commit and push these changes to the default branch of your forked repository

### Step 4: Import the forked repository
Import the forked repository containing the generated contracts in the `package.json` of both your client and server projects. This will allow you to use the ready-made fetch and server functions.

```json
//package.json
{
  "dependencies": {
    "scheme": "git+https://github.com/your-username/scheme-forked-repo.git"
  }
}
```

### Step 5: Use the server and client functions
Import and use the type-guarded functions in your projects. Use `run_server` for your servers and `create_fetchers` for your clients. Example:

```typescript
//server entry-point
import {run_server} from 'scheme/src/run_server';

run_server({
  //get_user's parameters will be typed and its return value type-guarded based on your schema
  get_user: async ({user_id}) => {
    console.log(`Getting ${user_id}`);
    const user = await some_db.get_user(user_id);
    if (!user) {
      return {
        status: 404,
        data: {
          message: `${user_id} not found!`
        }
      }
    }
    return {
      status: 200,
      //Runtime validation will catch any mismached type
      data: {
        name: user.name,
        age: user.age,
        user_type: user.user_type,
      }
    };
  },
  // additional endpoints here...
});
```

```typescript
//client

//fetchers.ts
import {create_fetchers} from 'scheme/src/create_fetchers';

const base_url = "http://localhost:4001";
const fetchers = create_fetchers(base_url);
export fetchers;

//example fetch function
import {fetchers} from './fetchers';

//get_result type is {
//    status: 200;
//    data: {
//        name: string;
//        age: number;
//        user_type: "teacher" | "student";
//    };
// } | {
//    status: 404;
//    data: {
//        message: string;
//    };
// }
const get_result = await fetchers.get_user({user_id: some_user_id});
switch (get_result.status) {
  case 200:
    const {age, name, user_type} = get_result.data;
    console.log(`Fetched ${name}, who is ${age} years old and a ${user_type}`);
    break;
  case 404:
    const {message} = get_result.data;
    console.log(`Failed to fetch due to error: ${message}`);
    break;
  default:
    const invalid: never = get_result;
    throw invalid;
}
```

Full examples can be seen in the [scheme-server-sample](https://github.com/omar-khalil/scheme-server-sample) and [scheme-client-sample](https://github.com/omar-khalil/scheme-client-sample) projects.


## TODO
- [ ] Export the dependency to package registry via GitHub actions to avoid having to directly import this repository in dependant projects
- [ ] Separate schema definition into its own repo
  - [ ] A separate sample project with a schema definition example
- [ ] More readable Zod validation errors
- [ ] Overridable fetch/server functions (use your own fetch and server engines)
- [ ] Customizable validation error handling
- [ ] ESLint

