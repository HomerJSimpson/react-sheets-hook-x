import * as React from "react";

import { useFetch } from "use-http";

export interface IUserIdentityCardProps {
  access_token?: string | undefined;
}

export default function UserIdentityCard({
  access_token,
}: IUserIdentityCardProps) {
  const {
    loading,
    error,
    data = [],
  } = useFetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}&alt=json`,
    undefined,
    [access_token]
  );
  console.log(`access_token ${access_token}`);
  return (
    <div>
      <h4>Welcome</h4>
      {loading && "loading..."}
      {error && "error"}
      {!loading && !error && data && (
        <pre>{JSON.stringify(data, undefined, "\t")}</pre>
      )}
    </div>
  );
}
