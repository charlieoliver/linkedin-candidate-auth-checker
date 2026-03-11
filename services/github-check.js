export async function checkGithubProfile(url){
  const username=url.split('github.com/')[1];

  const res=await fetch(`https://api.github.com/users/${username}`);

  if(!res.ok) return null;

  const data=await res.json();

  return {
    repos:data.public_repos,
    followers:data.followers,
    created_at:data.created_at
  };
}
