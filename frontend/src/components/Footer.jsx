import { memo } from 'react';

import { author } from '../../package.json';

import { repo } from '../utils/pkg';

const linkSeparator = '/';

const repoSplitted = repo.split(linkSeparator);
repoSplitted.pop();

const copyrightLink = repoSplitted.join(linkSeparator);

const yearOfBuild = new Date().getFullYear();

const Footer = memo(() => (
  <footer className="footer">
    <a target="_blank" rel="noreferrer" href={copyrightLink} className="footer__copyright">
      &copy; {yearOfBuild} {author}
    </a>
  </footer>
));

export default Footer;
