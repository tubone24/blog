import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronUp,
  faIdBadge,
  faRss,
  faClock,
  faNewspaper,
  faFile,
  faAngleRight,
  faUser,
  faLink,
  faSearch,
  faTags,
  faCloud,
} from '@fortawesome/free-solid-svg-icons';

import { faEnvelope, faComment, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import {
  faGithub,
  faFacebookF,
  faFacebook,
  faSoundcloud,
  faTwitter,
  faGetPocket,
  fa500px,
} from '@fortawesome/free-brands-svg-icons';

const installFontAwesome = () => {
  library.add(
    faComment,
    faChevronUp,
    faEnvelope,
    faGithub,
    faIdBadge,
    faFacebookF,
    faFacebook,
    faSoundcloud,
    faTwitter,
    faGetPocket,
    fa500px,
    faRss,
    faClock,
    faNewspaper,
    faFile,
    faAngleRight,
    faUser,
    faCalendarAlt,
    faLink,
    faSearch,
    faTags,
    faCloud,
  );
};

export default installFontAwesome;
