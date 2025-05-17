export const generateItemColor = (itemName) => {
  const hashCode = Array.from(itemName).reduce((hash, char) => {
    return (hash << 5) - hash + char.charCodeAt(0);
  }, 0);

  // Generate RGB color values based on hash code
  const r = (hashCode & 0xff0000) >> 16;
  const g = (hashCode & 0x00ff00) >> 8;
  const b = hashCode & 0x0000ff;

  // Adjust brightness (lower the brightness for a darker shade)
  const adjustBrightness = (colorValue, factor = 0.7) => Math.floor(colorValue * factor);

  // Apply brightness adjustment
  const newR = adjustBrightness(r);
  const newG = adjustBrightness(g);
  const newB = adjustBrightness(b);

  // Return the adjusted color in RGB format
  return `rgb(${newR}, ${newG}, ${newB})`;
};
export const isImageValid = (file) => {
  const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
  return allowedFormats.includes(file.type);
};

export const truncateText = (text, maxLength) => {
  if (!text) return ""; // Handle undefined or null text
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const inputClassName =
  "w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50";

export const CommonClassForInput = "w-full h-full p-2 rounded-lg highlightbg textColor text-xs 3xl:text-sm";

export const getIconUrls = (value) => [
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${value}/${value}-original.svg`,
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${value}/${value}-plain.svg`,
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${value}/${value}.svg`,
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${value}/${value}-original-wordmark.svg`,
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${value}/${value}-original.svg`,
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${value}/${value}-plain-wordmark.svg`,
];

export const iconMapping = [
  // Programming Languages
  { label: "HTML5", value: "html5" },
  { label: "CSS3", value: "css3" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cplusplus" },
  { label: "C#", value: "csharp" },
  { label: "PHP", value: "php" },
  { label: "Ruby", value: "ruby" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "Scala", value: "scala" },
  { label: "Dart", value: "dart" },
  { label: "R", value: "r" },
  { label: "Elixir", value: "elixir" },
  { label: "Haskell", value: "haskell" },
  { label: "Perl", value: "perl" },
  { label: "Elm", value: "elm" },
  { label: "Erlang", value: "erlang" },
  { label: "MATLAB", value: "matlab" },
  { label: "Deno.js", value: "denojs" },
  { label: ".NET", value: "dotnetcore" },

  // Frontend Frameworks/Libraries
  { label: "React", value: "react" },
  { label: "Angular", value: "angular" },
  { label: "AngularJS", value: "angularjs" },
  { label: "Vue.js", value: "vuejs" },
  { label: "Svelte", value: "svelte" },
  { label: "jQuery", value: "jquery" },
  { label: "Redux", value: "redux" },
  { label: "Next.js", value: "nextjs" },
  { label: "Nuxt.js", value: "nuxtjs" },
  { label: "Gatsby", value: "gatsby" },
  { label: "Electron", value: "electron" },
  { label: "Meteor", value: "meteor" },
  { label: "Handlebars", value: "handlebars" },
  { label: "Material-UI", value: "materialui" },
  { label: "Vuetify", value: "vuetify" },
  { label: "Storybook", value: "storybook" },

  // Backend/Fullstack
  { label: "Node.js", value: "nodejs" },
  { label: "Express", value: "express" },
  { label: "Django", value: "django" },
  { label: "Flask", value: "flask" },
  { label: "Spring", value: "spring" },
  { label: "Laravel", value: "laravel" },
  { label: "Ruby on Rails", value: "rails" },
  { label: "GraphQL", value: "graphql" },
  { label: "Socket.io", value: "socketio" },
  { label: "Symfony", value: "symfony" },
  { label: "CodeIgniter", value: "codeigniter" },
  { label: "Grails", value: "grails" },
  { label: "Hugo", value: "hugo" },

  // Mobile
  { label: "React Native", value: "react" },
  { label: "Flutter", value: "flutter" },
  { label: "Ionic", value: "ionic" },
  { label: "Xamarin", value: "xamarin" },
  { label: "Android", value: "android" },

  // Databases
  { label: "MySQL", value: "mysql" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MongoDB", value: "mongodb" },
  { label: "SQLite", value: "sqlite" },
  { label: "Firebase", value: "firebase" },
  { label: "Oracle", value: "oracle" },
  { label: "Microsoft SQL Server", value: "microsoftsqlserver" },
  { label: "Redis", value: "redis" },
  { label: "Apache Tomcat", value: "tomcat" },

  // DevOps & Cloud
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "AWS", value: "amazonwebservices" },
  { label: "Azure", value: "azure" },
  { label: "Google Cloud Platform", value: "googlecloud" },
  { label: "Heroku", value: "heroku" },
  { label: "DigitalOcean", value: "digitalocean" },
  { label: "Git", value: "git" },
  { label: "GitHub", value: "github" },
  { label: "GitLab", value: "gitlab" },
  { label: "Bitbucket", value: "bitbucket" },
  { label: "Jenkins", value: "jenkins" },
  { label: "Travis CI", value: "travis" },
  { label: "CircleCI", value: "circleci" },
  { label: "Ansible", value: "ansible" },
  { label: "Terraform", value: "terraform" },
  { label: "Vagrant", value: "vagrant" },
  { label: "NGINX", value: "nginx" },
  { label: "Apache", value: "apache" },
  { label: "Gradle", value: "gradle" },
  { label: "SSH", value: "ssh" },
  { label: "PuTTY", value: "putty" },

  // Testing
  { label: "Jest", value: "jest" },
  { label: "Mocha", value: "mocha" },
  { label: "Jasmine", value: "jasmine" },
  { label: "Selenium", value: "selenium" },
  { label: "Cypress", value: "cypressio" },

  // Design & Tools
  { label: "Figma", value: "figma" },
  { label: "Adobe XD", value: "xd" },
  { label: "Sketch", value: "sketch" },
  { label: "Adobe Photoshop", value: "photoshop" },
  { label: "Adobe Illustrator", value: "illustrator" },
  { label: "Adobe Premiere Pro", value: "premierepro" },
  { label: "VS Code", value: "vscode" },
  { label: "Visual Studio", value: "visualstudio" },
  { label: "IntelliJ IDEA", value: "intellij" },
  { label: "Eclipse", value: "eclipse" },
  { label: "WebStorm", value: "webstorm" },
  { label: "PyCharm", value: "pycharm" },
  { label: "PhpStorm", value: "phpstorm" },
  { label: "Android Studio", value: "androidstudio" },
  { label: "Xcode", value: "xcode" },
  { label: "Atom", value: "atom" },
  { label: "GIMP", value: "gimp" },
  { label: "Inkscape", value: "inkscape" },
  { label: "Blender", value: "blender" },
  { label: "Confluence", value: "confluence" },
  { label: "Sourcetree", value: "sourcetree" },
  { label: "Slack", value: "slack" },
  { label: "Safari", value: "safari" },

  // CSS Frameworks & Preprocessors
  { label: "Bootstrap", value: "bootstrap" },
  { label: "Tailwind CSS", value: "tailwindcss" },
  { label: "SASS", value: "sass" },
  { label: "LESS", value: "less" },
  { label: "Bulma", value: "bulma" },
  { label: "Materialize", value: "materializecss" },
  { label: "Foundation", value: "foundation" },
  { label: "Stylus", value: "stylus" },

  // Build Tools & Package Managers
  { label: "Webpack", value: "webpack" },
  { label: "Babel", value: "babel" },
  { label: "Gulp", value: "gulp" },
  { label: "Grunt", value: "grunt" },
  { label: "Rollup", value: "rollup" },
  { label: "npm", value: "npm" },
  { label: "Yarn", value: "yarn" },
  { label: "PNPM", value: "pnpm" },
  { label: "ESLint", value: "eslint" },

  // Data Science & AI
  { label: "Pandas", value: "pandas" },
  { label: "NumPy", value: "numpy" },
  { label: "TensorFlow", value: "tensorflow" },
  { label: "PyTorch", value: "pytorch" },
  { label: "Jupyter", value: "jupyter" },

  // Operating Systems
  { label: "Linux", value: "linux" },
  { label: "Ubuntu", value: "ubuntu" },
  { label: "Debian", value: "debian" },
  { label: "Windows", value: "windows8" },
  { label: "Unix", value: "unix" },
  { label: "Apple", value: "apple" },
  { label: "Bash", value: "bash" },
  { label: "Vim", value: "vim" },

  // Hardware & IoT
  { label: "Arduino", value: "arduino" },
  { label: "Raspberry Pi", value: "raspberrypi" },

  // CMS & Other
  { label: "WordPress", value: "wordpress" },
  { label: "Drupal", value: "drupal" },
  { label: "Three.js", value: "threejs" },
  { label: "Unity", value: "unity" },
  { label: "Unreal Engine", value: "unrealengine" },
  { label: "Webflow", value: "webflow" },
  { label: "MobX", value: "mobx" },
];
