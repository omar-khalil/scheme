import {create_fetchers} from "./src/create_fetchers";

const base = "http://localhost:4001";
const fetchers = create_fetchers(base);

const run_fetch = async () => {
  const post_result = await fetchers.post_user({name: "Bob", age: 30, user_type: "teacher"});
  console.log(post_result);

  const user = post_result.data;
  const get_result = await fetchers.get_user({user_id: user.user_id});
  console.log(get_result);
};

run_fetch();
