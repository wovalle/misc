import axios from "axios";
import fs from "fs";

type TwitterUser = {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  followers_count: number;
  friends_count: number;
};

type TwitterResponse = {
  users: TwitterUser[];
  next_cursor: number;
  next_cursor_str: string;
  previous_cursor: number;
  previous_cursor_str: string;
};

const baseApiUrl = "https://api.twitter.com/1.1";
const bearerToken = "<your bearer token>";

const findFollowers = async (screenName: string) => {
  const getOptions = (cursor: string) =>
    `screen_name=${screenName}&include_user_entities=false&count=200&skip_status=true&cursor=${cursor}`;

  let nextCursor = "-1";
  let users: TwitterUser[] = [];

  console.log("Started fetching ${screenName} followers...");

  while (nextCursor !== "0") {
    const twitterResponse = await axios.get<TwitterResponse>(
      `${baseApiUrl}/followers/list.json?${getOptions(nextCursor)}`,
      { headers: { Authorization: bearerToken } }
    );

    users = users.concat(twitterResponse.data.users);

    nextCursor = twitterResponse.data.next_cursor_str;
    console.log(
      `Fetched ${twitterResponse.data.users.length} new users, now ${users.length}, next cursor: ${nextCursor}`
    );

    await fs.promises.writeFile(
      `${__dirname}/followers.json`,
      JSON.stringify({ users })
    );
  }

  console.log("No more new users!");
};

const generateBenfordsStats = async () => {
  const { users } = await import("./followers.json");

  const followersBenfordsMap = users.reduce((acc, cur) => {
    const followersCount = `${cur.followers_count}`;
    const firstNumber = followersCount.slice(0, 1);
    acc.set(firstNumber, (acc.get(firstNumber) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  followersBenfordsMap.set("total", users.length);

  const stats = Array.from(followersBenfordsMap).sort((a, b) => a[0].localeCompare(b[0]));
  console.log({  stats  });
};

generateBenfordsStats(); 

