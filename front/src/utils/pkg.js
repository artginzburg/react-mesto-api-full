import { repository, homepage } from '../../package.json';

const apiHomepage = new URL(homepage);
apiHomepage.hostname = `api.${apiHomepage.hostname}`;
export const apiPath = apiHomepage;

const repoSeparator = '.';
const repoSplit = repository.url.split(repoSeparator);
repoSplit.pop();
const repoJoined = repoSplit.join(repoSeparator);
export const repo = repoJoined.split('+')[1];
