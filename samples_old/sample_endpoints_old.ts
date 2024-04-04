import express from "express";
import {
  endpoint_schema,
  params,
  response,
} from "../src/old/endpoints";
import extract_entries from "../src/helpers/extract_entries";

const app = express();
app.use(express.json());

type endpoint_keys = keyof typeof endpoint_schema;

const endpoint_implementations: {[p in endpoint_keys]: (params: params<p>) => response<p>} = {
  get_user: ({user_id, type}) => {
    console.log(`Getting ${user_id} of type ${type}`);
    if (user_id === 'error') {
      return {
        status: 404,
        data: {
          message: `${user_id} not found!`
        }
      }
    }
    return {
      status: 200,
      data: {
        name: "name!",
        age: 123,
      }
    };
  },
  post_user: ({name, age}) => {
    console.log(`Posting ${name} who is ${age} years old`);
    return {
      status: 200,
      data: {
        user_id: "user id!",
      }
    };
  },
  delete_user: ({user_id}) => {
    console.log(`Deleting ${user_id}`);
    return {
      status: 200,
      data: {
        message: `Successfully deleted ${user_id}`,
      }
    };
  },
};

const run_server = () => {
  extract_entries(endpoint_implementations).forEach(({key, value: method}) => {
    const {type, url, schema} = endpoint_schema[key];
    app[type](url, (req, res) => {
      const params = schema.params.parse(type === 'get' ? req.query : req.body); //validate request params against endpoint schema. Throws an error if params doesn't match

      const response = method(params as any); //now that params has been validated, it's safe to use 'as any' here
      res.status(200).send(response);
    });
  });

  const PORT = 4001;
  app.listen(PORT, () => {
    console.log(`api-server started on port http://localhost:${PORT}`);
  });
};

run_server();
