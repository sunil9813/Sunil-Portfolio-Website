export const truncateText = (text, maxLength) => {
  if (!text) return ""; // Handle undefined or null text
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
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
  { label: "Flask", value: "flask" },
  { label: "Spring", value: "spring" },
  { label: "Laravel", value: "laravel" },
  { label: "Socket.io", value: "socketio" },
  { label: "Symfony", value: "symfony" },
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
  { label: "Ansible", value: "ansible" },
  { label: "Terraform", value: "terraform" },
  { label: "Vagrant", value: "vagrant" },
  { label: "NGINX", value: "nginx" },
  { label: "Apache", value: "apache" },
  { label: "Gradle", value: "gradle" },
  { label: "SSH", value: "ssh" },
  { label: "PuTTY", value: "putty" },

  // Testing
  { label: "Mocha", value: "mocha" },
  { label: "Jasmine", value: "jasmine" },
  { label: "Selenium", value: "selenium" },
  { label: "Cypress", value: "cypressio" },

  // Design & Tools
  { label: "Figma", value: "figma" },
  { label: "Adobe XD", value: "xd" },
  { label: "Sketch", value: "sketch" },
  { label: "Adobe Photoshop", value: "photoshop" },
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
  { label: "Materialize", value: "materializecss" },
  { label: "Foundation", value: "foundation" },
  { label: "Stylus", value: "stylus" },

  // Build Tools & Package Managers
  { label: "Webpack", value: "webpack" },
  { label: "Babel", value: "babel" },
  { label: "Grunt", value: "grunt" },
  { label: "Rollup", value: "rollup" },
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

export const generateItemColor = (itemName, theme = "dark") => {
  const hashCode = Array.from(itemName).reduce((hash, char) => {
    return (hash << 5) - hash + char.charCodeAt(0);
  }, 0);

  // Generate base RGB values
  const r = (hashCode & 0xff0000) >> 16;
  const g = (hashCode & 0x00ff00) >> 8;
  const b = hashCode & 0x0000ff;

  // Adjust colors based on theme
  if (theme === "dark") {
    // For dark theme - brighter, more saturated colors
    const adjustForDark = (colorValue) => {
      const normalized = colorValue / 255;
      // Apply curve to boost mid-tones and saturation
      const adjusted = Math.pow(normalized, 0.7);
      return Math.floor(adjusted * 200 + 55); // Range: 55-255
    };
    return `rgb(${adjustForDark(r)}, ${adjustForDark(g)}, ${adjustForDark(b)})`;
  } else {
    // For light theme - darker, less saturated colors
    const adjustForLight = (colorValue) => {
      const normalized = colorValue / 255;
      // Apply curve to darken and desaturate slightly
      const adjusted = Math.pow(normalized, 1.3) * 0.8;
      return Math.floor(adjusted * 180 + 30); // Range: 30-210
    };
    return `rgb(${adjustForLight(r)}, ${adjustForLight(g)}, ${adjustForLight(b)})`;
  }
};
export const getRandomGradient = () => {
  const colors = [
    ["rgb(40, 11, 152)", "rgb(59, 150, 215)"],
    ["rgb(40, 11, 152)", "rgb(215, 59, 145)"],
    ["rgb(96, 3, 139)", "rgb(26, 172, 204)"],
    ["rgb(26, 172, 204)", "rgb(96, 3, 139)"],
    ["rgb(0, 91, 157)", "rgb(26, 105, 85)"],
    ["rgb(67, 22, 219)", "rgb(144, 118, 231)"],
    ["rgb(211, 49, 137)", "rgb(94, 44, 141)"],
    ["rgb(79, 73, 139)", "rgb(24, 16, 45)"],
    ["rgb(136, 0, 148)", "rgb(81, 77, 255)"],
    ["rgb(233, 109, 44)", "rgb(239, 77, 77)"],
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return `linear-gradient(180deg, ${colors[randomIndex][0]} 0%, ${colors[randomIndex][1]} 100%)`;
};

export const generateGradientBackground = (itemName, theme = "dark") => {
  const hashCode = Array.from(itemName).reduce((hash, char) => {
    return (hash << 5) - hash + char.charCodeAt(0);
  }, 0);

  // Generate base RGB values for two colors
  const r1 = (hashCode & 0xff0000) >> 16;
  const g1 = (hashCode & 0x00ff00) >> 8;
  const b1 = hashCode & 0x0000ff;

  // Generate second color by rotating bits
  const r2 = (hashCode & 0x00ff00) >> 8;
  const g2 = hashCode & 0x0000ff;
  const b2 = (hashCode & 0xff0000) >> 16;

  if (theme === "dark") {
    // For dark theme - brighter, more saturated colors
    const adjustForDark = (colorValue) => {
      const normalized = colorValue / 255;
      const adjusted = Math.pow(normalized, 0.7);
      return Math.floor(adjusted * 200 + 55); // Range: 55-255
    };

    const color1 = `rgb(${adjustForDark(r1)}, ${adjustForDark(g1)}, ${adjustForDark(b1)})`;
    const color2 = `rgb(${adjustForDark(r2)}, ${adjustForDark(g2)}, ${adjustForDark(b2)})`;

    return `linear-gradient(209.21deg, ${color1} 13.57%, ${color2} 98.38%)`;
  } else {
    // For light theme - darker, less saturated colors
    const adjustForLight = (colorValue) => {
      const normalized = colorValue / 255;
      const adjusted = Math.pow(normalized, 1.3) * 0.8;
      return Math.floor(adjusted * 180 + 30); // Range: 30-210
    };

    const color1 = `rgb(${adjustForLight(r1)}, ${adjustForLight(g1)}, ${adjustForLight(b1)})`;
    const color2 = `rgb(${adjustForLight(r2)}, ${adjustForLight(g2)}, ${adjustForLight(b2)})`;

    return `linear-gradient(209.21deg, ${color1} 13.57%, ${color2} 98.38%)`;
  }
};

export const bgGradients = [
  "linear-gradient(209.21deg, rgb(13, 23, 31) 13.57%, rgb(29, 37, 66) 98.38%)",
  "linear-gradient(209.21deg, rgb(12, 12, 12) 13.57%, rgb(26, 26, 26) 98.38%)",
  "linear-gradient(209.21deg, rgb(11, 11, 42) 13.57%, rgb(25, 31, 53) 98.38%)",
  "linear-gradient(209.21deg, rgb(10, 4, 20) 13.57%, rgb(29, 21, 43) 98.38%)",
  "linear-gradient(209.21deg, rgb(12, 13, 16) 13.57%, rgb(27, 29, 34) 98.38%)",
  "linear-gradient(209.21deg, rgb(73, 79, 254) 13.57%, rgb(15, 19, 36) 98.38%)",
  "linear-gradient(209.21deg, rgb(7, 11, 28) 13.57%, rgb(37, 45, 87) 98.38%)",
  "linear-gradient(209.21deg, rgb(28, 20, 50) 13.57%, rgb(9, 9, 20) 98.38%)",
  "linear-gradient(209.21deg, rgb(18, 30, 60) 13.57%, rgb(44, 68, 154) 98.38%)",
  "linear-gradient(209.21deg, rgb(9, 7, 28) 13.57%, rgb(105, 44, 154) 98.38%)",
  "linear-gradient(209.21deg, rgb(9, 9, 22) 13.57%, rgb(48, 47, 118) 98.38%)",
  "linear-gradient(209.21deg, rgb(255, 112, 112) 13.57%, rgb(27, 25, 62) 98.38%)",
  "linear-gradient(209.21deg, rgb(23, 18, 41) 13.57%, rgb(30, 17, 35) 98.38%)",
  "linear-gradient(209.21deg, rgb(1, 1, 1) 13.57%, rgb(33, 33, 45) 98.38%)",
  "linear-gradient(209.21deg, rgb(4, 0, 20) 13.57%, rgb(78, 78, 134) 98.38%)",
  "linear-gradient(209.21deg, rgb(8, 9, 29) 13.57%, rgb(20, 22, 52) 98.38%)",
  "linear-gradient(209.21deg, rgb(0, 0, 0) 13.57%, rgb(34, 34, 34) 98.38%)",
  "linear-gradient(209.21deg, rgb(14, 14, 14) 13.57%, rgb(44, 44, 44) 98.38%)",
  "linear-gradient(209.21deg, rgb(32, 25, 76) 13.57%, rgb(46, 42, 59) 98.38%)",
  "linear-gradient(209.21deg, rgb(27, 36, 49) 13.57%, rgb(28, 31, 34) 98.38%)",
  "linear-gradient(209.21deg, rgb(79, 73, 139) 13.57%, rgb(24, 16, 45) 98.38%)",
  "linear-gradient(209.21deg, rgb(29, 19, 36) 13.57%, rgb(0, 35, 124) 98.38%)",
  "linear-gradient(209.21deg, rgb(23, 23, 27) 13.57%, rgb(119, 63, 211) 98.38%)",
  "linear-gradient(209.21deg, rgb(76, 55, 109) 13.57%, rgb(31, 21, 53) 98.38%)",
  "linear-gradient(209.21deg, rgb(153, 40, 52) 13.57%, rgb(255, 114, 98) 98.38%)",
  "linear-gradient(209.21deg, rgb(233, 109, 44) 13.57%, rgb(239, 77, 77) 98.38%)",
  "linear-gradient(209.21deg, rgb(50, 150, 255) 13.57%, rgb(68, 23, 219) 98.38%)",
  "linear-gradient(209.21deg, rgb(29, 32, 38) 13.57%, rgb(47, 35, 84) 98.38%)",
  "linear-gradient(209.21deg, rgb(215, 65, 101) 13.57%, rgb(215, 81, 65) 98.38%)",
  "linear-gradient(209.21deg, rgb(15, 20, 57) 13.57%, rgb(0, 91, 157) 98.38%)",
  "linear-gradient(209.21deg, rgb(0, 175, 214) 13.57%, rgb(55, 1, 123) 98.38%)",
  "linear-gradient(209.21deg, rgb(8, 86, 142) 13.57%, rgb(0, 24, 85) 98.38%)",
  "linear-gradient(209.21deg, rgb(253, 173, 0) 13.57%, rgb(233, 109, 44) 98.38%)",
  "linear-gradient(209.21deg, rgb(0, 91, 157) 13.57%, rgb(15, 20, 57) 98.38%)",
  "linear-gradient(209.21deg, rgb(29, 145, 252) 13.57%, rgb(90, 54, 192) 98.38%)",
  "linear-gradient(209.21deg, rgb(255, 114, 98) 13.57%, rgb(153, 40, 52) 98.38%)",
  "linear-gradient(209.21deg, rgb(136, 0, 148) 13.57%, rgb(81, 77, 255) 98.38%)",
  "linear-gradient(209.21deg, rgb(101, 187, 118) 13.57%, rgb(70, 111, 171) 98.38%)",
  "linear-gradient(209.21deg, rgb(242, 136, 133) 13.57%, rgb(233, 79, 102) 98.38%)",
  "linear-gradient(209.21deg, rgb(142, 0, 0) 13.57%, rgb(255, 158, 211) 98.38%)",
  "linear-gradient(209.21deg, rgb(32, 0, 177) 13.57%, rgb(195, 79, 250) 98.38%)",
  "linear-gradient(209.21deg, rgb(215, 81, 65) 13.57%, rgb(215, 65, 101) 98.38%)",
  "linear-gradient(209.21deg, rgb(111, 78, 222) 13.57%, rgb(130, 210, 255) 98.38%)",
  "linear-gradient(209.21deg, rgb(72, 100, 246) 13.57%, rgb(173, 2, 254) 98.38%)",
  "linear-gradient(209.21deg, rgb(179, 19, 49) 13.57%, rgb(209, 91, 88) 98.38%)",
  "linear-gradient(209.21deg, rgb(4, 20, 104) 13.57%, rgb(73, 18, 229) 98.38%)",
  "linear-gradient(209.21deg, rgb(89, 0, 159) 13.57%, rgb(16, 114, 204) 98.38%)",
  "linear-gradient(209.21deg, rgb(35, 0, 252) 13.57%, rgb(172, 1, 215) 98.38%)",
  "linear-gradient(209.21deg, rgb(89, 42, 121) 13.57%, rgb(232, 126, 114) 98.38%)",
  "linear-gradient(209.21deg, rgb(4, 55, 174) 13.57%, rgb(29, 81, 146) 98.38%)",
  "linear-gradient(209.21deg, rgb(16, 114, 204) 13.57%, rgb(89, 0, 159) 98.38%)",
  "linear-gradient(209.21deg, rgb(0, 6, 149) 13.57%, rgb(116, 69, 154) 98.38%)",
  "linear-gradient(209.21deg, rgb(87, 15, 141) 13.57%, rgb(243, 91, 160) 98.38%)",
  "linear-gradient(209.21deg, rgb(22, 155, 173) 13.57%, rgb(0, 54, 135) 98.38%)",
  "linear-gradient(209.21deg, rgb(73, 38, 173) 13.57%, rgb(52, 53, 99) 98.38%)",
  "linear-gradient(209.21deg, rgb(12, 39, 178) 13.57%, rgb(133, 218, 213) 98.38%)",
  "linear-gradient(209.21deg, rgb(48, 173, 221) 13.57%, rgb(64, 26, 190) 98.38%)",
  "linear-gradient(209.21deg, rgb(225, 72, 133) 13.57%, rgb(241, 67, 102) 98.38%)",
  "linear-gradient(209.21deg, rgb(57, 17, 123) 13.57%, rgb(191, 149, 248) 98.38%)",
  "linear-gradient(209.21deg, rgb(10, 57, 136) 13.57%, rgb(188, 168, 255) 98.38%)",
  "linear-gradient(209.21deg, rgb(90, 54, 192) 13.57%, rgb(29, 145, 252) 98.38%)",
  "linear-gradient(209.21deg, rgb(45, 14, 171) 13.57%, rgb(109, 81, 231) 98.38%)",
  "linear-gradient(209.21deg, rgb(17, 39, 174) 13.57%, rgb(90, 113, 251) 98.38%)",
  "linear-gradient(209.21deg, rgb(193, 48, 39) 13.57%, rgb(226, 131, 115) 98.38%)",
  "linear-gradient(209.21deg, rgb(14, 11, 147) 13.57%, rgb(94, 182, 202) 98.38%)",
  "linear-gradient(209.21deg, rgb(0, 24, 69) 13.57%, rgb(54, 135, 216) 98.38%)",
  "linear-gradient(209.21deg, rgb(60, 11, 140) 13.57%, rgb(227, 166, 254) 98.38%)",
  "linear-gradient(209.21deg, rgb(31, 118, 167) 13.57%, rgb(145, 130, 191) 98.38%)",
  "linear-gradient(209.21deg, rgb(29, 11, 140) 13.57%, rgb(189, 166, 254) 98.38%)",
  "linear-gradient(209.21deg, rgb(12, 16, 151) 13.57%, rgb(0, 133, 175) 98.38%)",
  "linear-gradient(209.21deg, rgb(146, 8, 169) 13.57%, rgb(233, 161, 161) 98.38%)",
  "linear-gradient(209.21deg, rgb(91, 51, 162) 13.57%, rgb(175, 76, 218) 98.38%)",
  "linear-gradient(209.21deg, rgb(250, 135, 117) 13.57%, rgb(216, 58, 58) 98.38%)",
  "linear-gradient(209.21deg, rgb(47, 26, 198) 13.57%, rgb(12, 103, 138) 98.38%)",
  "linear-gradient(209.21deg, rgb(175, 16, 47) 13.57%, rgb(212, 146, 228) 98.38%)",
  "linear-gradient(209.21deg, rgb(33, 8, 140) 13.57%, rgb(64, 194, 220) 98.38%)",
  "linear-gradient(209.21deg, rgb(63, 55, 201) 13.57%, rgb(165, 83, 218) 98.38%)",
  "linear-gradient(209.21deg, rgb(210, 145, 255) 13.57%, rgb(31, 0, 64) 98.38%)",
  "linear-gradient(209.21deg, rgb(200, 11, 11) 13.57%, rgb(242, 165, 93) 98.38%)",
  "linear-gradient(209.21deg, rgb(120, 5, 115) 13.57%, rgb(246, 203, 196) 98.38%)",
  "linear-gradient(209.21deg, rgb(62, 3, 138) 13.57%, rgb(99, 221, 246) 98.38%)",
  "linear-gradient(209.21deg, rgb(66, 13, 178) 13.57%, rgb(34, 137, 170) 98.38%)",
  "linear-gradient(209.21deg, rgb(239, 77, 77) 13.57%, rgb(233, 109, 44) 98.38%)",
  "linear-gradient(209.21deg, rgb(15, 12, 156) 13.57%, rgb(2, 114, 194) 98.38%)",
];
