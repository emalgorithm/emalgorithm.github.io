// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-presentations",
          title: "Presentations",
          description: "Collection of some presentations and talks I have given in the past.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/presentations/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-temporal-graph-learning-in-2024-towards-data-science",
        
          title: 'Temporal Graph Learning in 2024 | Towards Data Science <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Continue the journey for evolving networks",
        section: "Posts",
        handler: () => {
          
            window.open("https://towardsdatascience.com/temporal-graph-learning-in-2024-feaa9371b8e2/", "_blank");
          
        },
      },{id: "post-temporal-graph-benchmark-towards-data-science",
        
          title: 'Temporal Graph Benchmark | Towards Data Science <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Challenging and realistic datasets for temporal graph learning",
        section: "Posts",
        handler: () => {
          
            window.open("https://towardsdatascience.com/temporal-graph-benchmark-bb5cc26fcf11/", "_blank");
          
        },
      },{id: "post-gnns-on-directed-graphs",
        
          title: "GNNs on Directed Graphs",
        
        description: "Graph Neural Networks (GNNs) are extremely effective at modelling relational data. However, current GNN models frequently assume the input graph to be undirected, overlooking the inherent directionality of many real-world graphs, such as social, transportation, transaction, and citation networks. In this blog post, we explore the impact of edge directionality in the context of heterophilic graphs and outline Dir-GNN, a novel message passing scheme for directed graphs allowing a separate aggregation of incoming and outgoing edges. Despite its simplicity, this scheme achieves significant performance improvement on multiple real-world heterophilic directed graphs.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/dirgnn/";
          
        },
      },{id: "post-learning-network-games",
        
          title: "Learning Network Games",
        
        description: "Network games are a powerful tool for modelling strategic interactions between individuals or organisations played out on networks, where a player&#39;s payoff depends not only on their own actions but also on those of their neighbours. Such games have numerous applications in economics and social sciences, including studying the spread of influence in social networks, the dynamics of financial markets, and the formation of alliances in international relations. The study of network games typically assumes the underlying network structure to be known, which is often wishful thinking. Recently, machine learning approaches have been proposed to tackle this problem by leveraging the observed actions of players to learn the underlying network structure. In this blog post, we outline a novel approach that uses a transformer-like architecture to infer the network structure of a game without explicit knowledge of the utility function associated with the game.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/network_games/";
          
        },
      },{id: "post-temporal-graph-learning-in-2023-towards-data-science",
        
          title: 'Temporal Graph Learning in 2023 | Towards Data Science <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "The story so far",
        section: "Posts",
        handler: () => {
          
            window.open("https://towardsdatascience.com/temporal-graph-learning-in-2023-d28d1640dbf2/", "_blank");
          
        },
      },{id: "post-accelerating-and-scaling-temporal-graph-networks-on-the-graphcore-ipu",
        
          title: 'Accelerating and scaling temporal graph networks on the Graphcore IPU <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "In this post, we explore the implementation of temporal GNNs on a new architecture developed by Graphcore that is tailored to graph-structured workloads.",
        section: "Posts",
        handler: () => {
          
            window.open("https://www.graphcore.ai/posts/accelerating-and-scaling-temporal-graph-networks-on-the-graphcore-ipu", "_blank");
          
        },
      },{id: "post-just-a-moment",
        
          title: 'Just a moment... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.x.com/engineering/en_us/topics/insights/2022/graph-machine-learning-with-missing-node-features", "_blank");
          
        },
      },{id: "post-just-a-moment",
        
          title: 'Just a moment... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.x.com/engineering/en_us/topics/insights/2021/temporal-graph-networks", "_blank");
          
        },
      },{id: "post-simple-scalable-graph-neural-networks-by-michael-bronstein-tds-archive-medium",
        
          title: 'Simple scalable graph neural networks | by Michael Bronstein | TDS Archive |... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Graph Neural Networks (GNNs) are a class of ML models that have emerged in recent years for learning on graph-structured data. GNNs have been successfully applied to model systems of relation and…",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/simple-scalable-graph-neural-networks-7eb04f366d07", "_blank");
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-graduated-with-a-beng-in-computing-from-imperial-college-london",
          title: 'Graduated with a BEng in Computing from Imperial College London.',
          description: "",
          section: "News",},{id: "news-started-an-mphil-in-advanced-computer-science-at-cambridge",
          title: 'Started an MPhil in Advanced Computer Science at Cambridge.',
          description: "",
          section: "News",},{id: "news-started-working-part-time-as-a-data-scientist-for-fabula-ai-a-start-up-using-geometric-deep-learning-to-solve-fake-news-detection",
          title: 'Started working part-time as a data scientist for Fabula AI, a start-up using...',
          description: "",
          section: "News",},{id: "news-moved-to-ucla-as-a-visiting-researcher-during-ipam-long-program-on-learning-from-geometric-data",
          title: 'Moved to UCLA as a visiting researcher during IPAM long program on learning...',
          description: "",
          section: "News",},{id: "news-fabula-ai-is-acquired-by-twitter-we-join-the-machine-learning-team-in-london-including-magic-pony-to-work-on-fundamental-and-applied-research-around-graph-neural-networks",
          title: 'Fabula AI is acquired by Twitter. We join the machine learning team in...',
          description: "",
          section: "News",},{id: "news-graduated-with-distinction-from-an-mphil-in-advanced-computer-science-at-cambridge",
          title: 'Graduated with distinction from an MPhil in Advanced Computer Science at Cambridge.',
          description: "",
          section: "News",},{id: "news-forbes-italy-published-an-article-about-leadthefuture-the-mentoring-non-profit-which-i-co-founded-soon-after-my-cofounders-and-i-were-also-included-in-the-100-under-30-by-forbes-italy-on-the-most-talented-young-leaders-in-the-country",
          title: 'Forbes Italy published an article about LeadTheFuture, the mentoring non-profit which I co-founded....',
          description: "",
          section: "News",},{id: "news-i-ve-attended-mlss-2020-tuebingen",
          title: 'I’ve attended MLSS 2020 Tuebingen 🏫',
          description: "",
          section: "News",},{id: "news-published-blog-posts-on-our-new-papers-on-temporal-graph-networks-and-scalable-gnns",
          title: 'Published blog posts on our new papers on Temporal Graph Networks and scalable...',
          description: "",
          section: "News",},{id: "news-started-a-phd-at-imperial-college-london-supervised-by-prof-michael-bronstein-the-phd-will-largely-overlap-with-my-current-research-at-twitter-and-i-will-continue-working-on-gnns",
          title: 'Started a PhD at Imperial College London, supervised by Prof. Michael Bronstein. The...',
          description: "",
          section: "News",},{id: "news-our-paper-grand-graph-neural-diffusion-has-been-accepted-as-a-spotlight-at-icml-2021",
          title: 'Our paper “GRAND: Graph Neural Diffusion” has been accepted as a spotlight at...',
          description: "",
          section: "News",},{id: "news-i-moved-permanently-to-barcelona-from-london-where-i-will-continue-working-remotely-in-my-current-role-at-twitter-as-well-as-learning-spanish",
          title: 'I moved permanently to Barcelona (from London), where I will continue working remotely...',
          description: "",
          section: "News",},{id: "news-published-a-blog-posts-on-our-new-paper-on-learning-on-graphs-with-missing-node-features",
          title: 'Published a blog posts on our new paper on Learning on Graphs with...',
          description: "",
          section: "News",},{id: "news-our-paper-learning-to-infer-structures-of-network-games-has-been-accepted-as-a-spotlight-at-icml-2022",
          title: 'Our paper “Learning to Infer Structures of Network Games” has been accepted as...',
          description: "",
          section: "News",},{id: "news-published-a-blog-posts-on-our-collaboration-with-graphcore-on-accelerating-and-scaling-temporal-graph-networks-on-the-graphcore-ipu",
          title: 'Published a blog posts on our collaboration with GraphCore on “Accelerating and scaling...',
          description: "",
          section: "News",},{id: "news-our-paper-provably-efficient-causal-model-based-reinforcement-learning-for-environment-agnostic-generalization-has-been-accepted-at-aaai-2023",
          title: 'Our paper “Provably Efficient Causal Model-Based Reinforcement Learning for Environment-Agnostic Generalization” has been...',
          description: "",
          section: "News",},{id: "news-our-paper-on-the-unreasonable-effectiveness-of-feature-propagation-in-learning-on-graphs-with-missing-node-features-has-been-accepted-at-the-new-learning-on-graphs-conference",
          title: 'Our paper “On the Unreasonable Effectiveness of Feature propagation in Learning on Graphs...',
          description: "",
          section: "News",},{id: "news-our-paper-graph-neural-networks-for-link-prediction-with-subgraph-sketching-has-been-accepted-at-iclr-2022-as-an-oral-presentation-top-5",
          title: 'Our paper “Graph Neural Networks for Link Prediction with Subgraph Sketching” has been...',
          description: "",
          section: "News",},{id: "news-new-blog-posts-on-our-recent-paper-on-learning-to-infer-structures-of-network-games",
          title: 'New blog posts on our recent paper on Learning to Infer Structures of...',
          description: "",
          section: "News",},{id: "news-our-new-paper-on-graph-neural-networks-for-directed-graphs-and-how-they-improve-learning-on-heterophilic-graph-is-out-along-with-its-associated-blog-post",
          title: 'Our new paper on Graph Neural Networks for Directed Graphs, and how they...',
          description: "",
          section: "News",},{id: "news-we-are-excited-to-release-the-temporal-graph-benchmark-a-collection-of-seven-realistic-large-scale-and-diverse-benchmarks-for-learning-on-temporal-graphs-the-accompanying-paper-has-been-accepted-to-neurips-2023-datasets-and-benchmark-track",
          title: 'We are excited to release the Temporal Graph Benchmark, a collection of seven...',
          description: "",
          section: "News",},{id: "news-i-m-thrilled-to-announce-that-i-ve-joined-vant-ai-as-a-machine-learning-researcher-vant-combines-a-compelling-ml-vision-with-a-proprietary-data-generation-platform-focusing-on-the-novel-field-of-molecular-glues-i-ll-be-developing-generative-models-for-structural-biology-to-advance-the-drug-discovery-process",
          title: 'I’m thrilled to announce that I’ve joined Vant AI as a Machine Learning...',
          description: "",
          section: "News",},{id: "news-the-lack-of-large-high-quality-datasets-and-robust-evaluation-is-holding-back-ml-in-drug-discovery-we-are-releasing-pinder-protein-protein-and-plinder-protein-ligand-to-help-bridge-this-gap-and-drive-meaningful-progress",
          title: 'The lack of large, high-quality datasets and robust evaluation is holding back ML...',
          description: "",
          section: "News",},{id: "news-excited-to-finally-share-what-we-ve-been-working-on-at-vant-ai-for-the-past-year-and-a-half-neo-1-a-unified-model-for-all-atom-structure-prediction-and-generation-of-all-biomolecules",
          title: 'Excited to finally share what we’ve been working on at Vant AI for...',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%65%6D%61%6E%75%65%6C%65.%72%6F%73%73%69%31%39%30%39@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/emalgorithm", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/emanuele-rossi", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=DHlkBOYAAAAJ", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/emaros96", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
