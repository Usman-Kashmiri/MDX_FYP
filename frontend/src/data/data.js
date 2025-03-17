import {
  AiFillQuestionCircle,
  AiOutlineAppstore,
  AiOutlinePhone,
  AiOutlineSetting,
  AiTwotoneHome,
} from "react-icons/ai";
import client_1 from "../assets/images/clients/client-1.png";
import client_2 from "../assets/images/clients/client-2.png";
import client_3 from "../assets/images/clients/client-3.png";
import client_4 from "../assets/images/clients/client-4.png";
import client_5 from "../assets/images/clients/client-5.png";
import client_6 from "../assets/images/clients/client-6.png";
import { MdEventAvailable } from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import {
  FaChessQueen,
  FaLandmark,
  FaLayerGroup,
  FaQuestionCircle,
  FaUserCircle,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import { BiMoneyWithdraw, BiWorld } from "react-icons/bi";
import { GrContact } from "react-icons/gr";
import { SlEnvolopeLetter } from "react-icons/sl";
import { CgWebsite } from "react-icons/cg";
import { PiSlideshow } from "react-icons/pi";
import { SiAboutdotme } from "react-icons/si";
import { GoLaw } from "react-icons/go";
import Lawyer from "../assets/icons/Lawyer";

export const headerNavigation = [
  {
    icon: AiTwotoneHome,
    name: "home",
    path: "/",
  },
  {
    icon: Lawyer,
    name: "Legal Professionals",
    path: "/legal-professionals",
  },
  {
    icon: GoLaw,
    name: "practice areas",
    path: "/practice-areas",
  },
  {
    icon: AiOutlinePhone,
    name: "Contact Us",
    path: "/contact-us",
  },
  {
    icon: SiAboutdotme,
    name: "About Us",
    path: "/about-us",
  },
  {
    icon: FaQuestionCircle,
    name: "FAQs",
    path: "/faqs",
  },
];

export const milestones = [
  {
    count: 1000,
    text: "Qualified Lawyers",
  },
  {
    count: 32154,
    text: "Trusted clients",
  },
  {
    count: 114586,
    text: "Successful Cases",
  },
  {
    count: 2000,
    text: "Honor & Awards",
  },
];

export const details = [
  {
    heading: "Story & History",
    description:
      "Founded by James Hall and David Sykes, two forward-thinking law school graduates, The MDX Lawsuit was born from a shared vision to transform the legal industry and make justice accessible to all...",
    link: "#",
  },
  {
    heading: "Values & Philosophy",
    description:
      "At The MDX Lawsuit, we believe in the inherent right of legal access for all, regardless of economic standing or complexity of need. Guided by principles of  transparency, affordability, innovation, and equality...",
    link: "#",
  },
  {
    heading: "Services",
    description:
      "At The MDX Lawsuit, we recognize that legal needs vary widely, and a one-size-fits-all approach often falls short. That's why we've curated a marketplace offering a comprehensive suite of The MDX Lawsuit legal services across all areas of law...",
    link: "#",
  },
];

export const story_and_history = `Founded by James Hall and David Sykes, two forward-thinking law school graduates, The MDX Lawsuit was born from a shared
vision to transform the legal industry and make justice accessible to all.
During their time in law school, both founders were deeply troubled by the stark inequalities in access to legal 
services. They observed that the barriers were not merely economic but were also entrenched in the very structure of 
the legal system. Moreover, they recognized that the industry was hampered by outdated billing practices that often 
left clients confused and financially strained.
Inspired to find a solution, they explored the concept of The MDX Lawsuit legal services. This innovative approach breaks 
down legal assistance into individual components, allowing clients to select and pay for only the services they need. It
represents a paradigm shift in legal support, ensuring transparency, affordability, and accessibility.
The MDX Lawsuit was established to bring this idea to life, creating a marketplace that connects individuals with seasoned legal 
professionals. The platform's user-friendly design enables clients to easily browse, select, and purchase a wide array 
of legal services tailored to their specific needs.
Because it’s well past the time for affordable legal services, The MDX Lawsuit is set to become a symbol of a new era in legal 
access. It continues to work towards its mission to democratize the legal field and contribute to a fairer and more just 
society.`;

export const values_and_philosophy = `At The MDX Lawsuit, we believe 
in the inherent right to legal access for all, regardless of economic 
standing or complexity of need. Guided by principles of 
transparency, affordability, innovation, and equality, we've created 
a marketplace that demystifies the legal landscape. By embracing 
The MDX Lawsuit legal services, we empower our clients to choose tailored
solutions that fit their unique circumstances. We are committed to 
bridging the gap between individuals and legal professionals, 
fostering a community where justice is not a privilege but a shared 
responsibility. Our unwavering dedication to these values drives us 
to continually strive for a fairer legal system, one service at a time.`;

export const services_text = `At The MDX Lawsuit, we
recognize that legal needs vary widely, and a one-size-fits-all 
approach often falls short. That's why we've curated a marketplace 
offering a comprehensive suite of The MDX Lawsuit legal services across 
all areas of law. The lawyers who use this platform give you the 
flexibility and affordability you need, tailored to your unique legal 
situation.`;

export const servicesData = [
  {
    id: 1,
    svg: (
      <svg
        width="45"
        height="64"
        viewBox="0 0 45 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M43.899 10.8094C42.565 9.45181 40.3821 9.45181 39.0481 10.8094L29.9527 20.1888H22.7976H15.6425L6.54708 10.9328C5.21308 9.57523 3.03018 9.57523 1.69618 10.9328C0.362179 12.2903 0.362179 14.5118 1.69618 15.8693L12.8533 27.2233V59.1874C12.8533 61.5323 14.6723 63.5069 17.0978 63.5069C19.402 63.5069 21.3423 61.6557 21.3423 59.1874V44.6246H22.9189H24.4954V59.064C24.4954 61.4089 26.3145 63.3835 28.74 63.3835C31.0441 63.3835 32.9845 61.5323 32.9845 59.064V27.2233L44.1416 15.8693C45.233 14.5118 45.233 12.2903 43.899 10.8094Z"
          fill="currentColor"
        />
        <path
          d="M22.7976 18.3159C27.553 18.3159 31.408 14.3929 31.408 9.55355C31.408 4.71424 27.553 0.791199 22.7976 0.791199C18.0422 0.791199 14.1873 4.71424 14.1873 9.55355C14.1873 14.3929 18.0422 18.3159 22.7976 18.3159Z"
          fill="currentColor"
        />
      </svg>
    ),
    image: "http://7oroof.com/demos/trust/images/practice-area-1-blog.jpg",
    heading: "Family Law",
    slug: "family-law",
    description:
      "Family law consists of a body of statutes and case precedents that govern the legal responsibilities between individuals who share a domestic connection.",
  },
  {
    id: 2,
    svg: (
      <svg
        width="52"
        height="66"
        viewBox="0 0 52 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.7391 45.3375C14.8131 46.9038 16.1681 48.3923 17.803 49.801C19.4383 51.2095 21.0908 52.4241 22.7624 53.4444C24.4336 54.4652 26.3434 55.4728 28.4916 56.4695L28.4556 56.4329L28.599 56.4695C26.9994 53.3598 26.2 50.6395 26.2 48.3072C26.2 47.068 26.4927 45.8958 27.0779 44.7911C27.6625 43.6853 28.426 42.6947 29.369 41.821C30.3124 40.9467 31.3566 40.0723 32.5021 39.1977C33.6476 38.3226 34.7931 37.3813 35.9399 36.3737C37.0855 35.3657 38.1301 34.2964 39.0729 33.1669C40.0159 32.0371 40.7793 30.6707 41.3648 29.0674C41.9493 27.464 42.2421 25.7147 42.2421 23.8203C42.2421 21.4395 41.9134 19.2047 41.2574 17.1154C40.6009 15.0263 39.7355 13.198 38.6617 11.6314C37.5879 10.0647 36.2334 8.57654 34.5972 7.16815C32.962 5.75911 31.3096 4.54446 29.6384 3.52444C27.9671 2.50417 26.0575 1.49602 23.9094 0.5L23.945 0.536757L23.8377 0.5C25.4129 3.65769 26.2004 6.37876 26.2004 8.66193C26.2004 9.90083 25.908 11.0731 25.3231 12.1781C24.738 13.2834 23.9744 14.2732 23.0316 15.1479C22.0885 16.0223 21.0443 16.8969 19.8985 17.7716C18.7523 18.646 17.6064 19.5875 16.4607 20.5956C15.3149 21.6036 14.2707 22.6726 13.3276 23.8019C12.3848 24.9317 11.6212 26.2981 11.0361 27.9014C10.4515 29.5048 10.1588 31.2541 10.1588 33.1485C10.1588 35.5293 10.4863 37.7642 11.1428 39.8532C11.7995 41.9424 12.665 43.7712 13.7391 45.3375Z"
          fill="currentColor"
        />
        <path
          d="M51.0681 61.4801C50.841 61.2499 50.5728 61.1351 50.2629 61.1351H2.13811C1.82783 61.1351 1.55931 61.2499 1.33256 61.4801C1.10568 61.7108 0.992432 61.9841 0.992432 62.2999V64.6319C0.992432 64.9483 1.10568 65.2211 1.33256 65.4522C1.55944 65.6833 1.82783 65.7982 2.13811 65.7982H50.2629C50.5728 65.7982 50.841 65.6833 51.0681 65.4522C51.2947 65.2211 51.4085 64.9483 51.4085 64.6319V62.2999C51.4085 61.9841 51.2955 61.7108 51.0681 61.4801Z"
          fill="currentColor"
        />
      </svg>
    ),
    image: "http://7oroof.com/demos/trust/images/practice-area-2-blog.jpg",
    heading: "Fire Accident",
    slug: "fire-accident",
    description:
      "Fire accidents can result in catastrophic personal injury and devastating damage. Every year, billions of dollars in property damage occurs as a result of fire.",
  },
  {
    id: 3,
    svg: (
      <svg
        width="66"
        height="58"
        viewBox="0 0 66 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50.8036 52.6494C50.8036 54.0302 51.2922 55.2082 52.2658 56.184C53.2394 57.1607 54.4157 57.6494 55.794 57.6494C57.1701 57.6494 58.3465 57.1607 59.3201 56.184C60.2946 55.2082 60.7823 54.0302 60.7823 52.6494C60.7823 51.2686 60.2952 50.0907 59.3201 49.1139C58.3465 48.1381 57.1701 47.6494 55.794 47.6494C54.4157 47.6494 53.2394 48.1381 52.2658 49.1139C51.2922 50.0907 50.8036 51.2686 50.8036 52.6494Z"
          fill="currentColor"
        />
        <path
          d="M65.0299 6.39051C64.536 5.89564 63.9517 5.64813 63.276 5.64813H16.4668C16.4405 5.46603 16.382 5.13425 16.2911 4.65251C16.2002 4.1705 16.1289 3.78659 16.0769 3.49982C16.0246 3.21429 15.9277 2.86896 15.7845 2.46535C15.6416 2.06146 15.4727 1.74213 15.2779 1.50831C15.0834 1.27325 14.8236 1.072 14.4987 0.902205C14.1741 0.733509 13.8036 0.648682 13.388 0.648682H3.41044C2.73443 0.648682 2.14988 0.896595 1.65625 1.39078C1.16248 1.88551 0.915527 2.47178 0.915527 3.14875C0.915527 3.82572 1.16248 4.41171 1.65625 4.90645C2.15029 5.40132 2.73497 5.64855 3.41044 5.64855H11.3605L18.2588 37.7974C18.2072 37.9014 17.9409 38.3957 17.4599 39.2816C16.9793 40.1675 16.5961 40.9419 16.3105 41.6059C16.0248 42.2707 15.8818 42.7847 15.8818 43.149C15.8818 43.826 16.1288 44.4121 16.6223 44.9077C17.1166 45.401 17.701 45.6494 18.3766 45.6494H20.871H55.793H58.2859C58.9614 45.6494 59.5462 45.4012 60.0397 44.9077C60.5339 44.4123 60.7805 43.8261 60.7805 43.149C60.7805 42.4719 60.5339 41.8858 60.0397 41.3913C59.5463 40.8969 58.9615 40.6487 58.2859 40.6487H22.4294C23.0533 39.3984 23.3651 38.566 23.3651 38.1493C23.3651 37.8881 23.3326 37.6015 23.2675 37.2897C23.2024 36.9779 23.1245 36.6323 23.0336 36.2541C22.9426 35.8776 22.8844 35.5975 22.8585 35.415L63.5498 30.6495C64.1987 30.5708 64.7318 30.2919 65.1474 29.8094C65.5633 29.3281 65.7706 28.7748 65.7706 28.1494V8.14902C65.7704 7.47205 65.5241 6.88606 65.0299 6.39051Z"
          fill="currentColor"
        />
        <path
          d="M15.8817 52.6494C15.8817 54.0302 16.3687 55.2082 17.3432 56.184C18.3181 57.1607 19.4933 57.6494 20.8709 57.6494C22.2476 57.6494 23.4235 57.1607 24.3977 56.184C25.3722 55.2082 25.8597 54.0302 25.8597 52.6494C25.8597 51.2686 25.3726 50.0907 24.3977 49.1139C23.4234 48.1381 22.2476 47.6494 20.8709 47.6494C19.4934 47.6494 18.3175 48.1381 17.3432 49.1139C16.3692 50.0907 15.8817 51.2686 15.8817 52.6494Z"
          fill="currentColor"
        />
      </svg>
    ),
    image: "http://7oroof.com/demos/trust/images/practice-area-3-blog.jpg",
    heading: "Shoplifting",
    slug: "shoplifting",
    description:
      "Shoplifting law deals with theft crimes that occur in retail establishments. Perpetrators are shoppers who enter the establishment with permission.",
  },
  {
    id: 4,
    svg: (
      <svg
        width="45"
        height="63"
        viewBox="0 0 45 63"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M43.5894 34.1101L34.1157 20.3659C32.7938 18.4663 30.7008 17.3489 28.4976 17.3489H22.549H16.6004C14.3972 17.3489 12.1941 18.4663 10.9823 20.3659L1.28832 34.1101C0.186726 35.6745 0.627362 37.7976 2.16959 38.8033C3.60166 39.809 5.58452 39.362 6.68611 37.9094L15.0582 25.2825L15.3887 31.7636L7.56738 44.8373C6.57595 46.5135 7.7877 48.5248 9.6604 48.5248L15.7191 48.4131V57.0172C15.7191 59.9225 18.0325 62.269 20.8966 62.269H22.549H24.2014C27.0655 62.269 29.3789 59.9225 29.3789 57.0172V48.4131L35.4376 48.5248C37.3103 48.5248 38.5221 46.5135 37.5306 44.8373L29.5992 31.7636L29.9297 25.2825L38.3018 37.9094C39.2932 39.362 41.2761 39.809 42.8183 38.8033C44.2503 37.7976 44.691 35.5628 43.5894 34.1101Z"
          fill="currentColor"
        />
        <path
          d="M22.4388 15.8963C26.7584 15.8963 30.2601 12.3443 30.2601 7.96265C30.2601 3.58101 26.7584 0.0289917 22.4388 0.0289917C18.1193 0.0289917 14.6176 3.58101 14.6176 7.96265C14.6176 12.3443 18.1193 15.8963 22.4388 15.8963Z"
          fill="currentColor"
        />
      </svg>
    ),
    image: "http://7oroof.com/demos/trust/images/practice-area-4-blog.jpg",
    heading: "Sexual Offences",
    slug: "sexual-offences",
    description:
      "The legal restrictions placed on the use of controlled drugs are aimed at preventing drug misuse. The principal offences are contained in the Misuse of Drugs Act 1971.",
  },
  {
    id: 5,
    svg: (
      <svg
        width="51"
        height="65"
        viewBox="0 0 51 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.8133 41.361L29.0397 40.2184C30.2847 37.4762 30.8507 34.8483 30.7375 32.1062C41.2637 33.363 47.4889 28.6785 49.0735 17.4813C41.1505 16.91 34.9253 17.8241 32.0957 23.9939V20.909C36.6231 10.5116 33.9067 3.65622 24.6255 0C24.6255 0 14.2124 9.36906 28.8133 22.0516L28.2474 28.4499C28.2474 28.4499 24.0596 12.7968 9.11911 19.0809C9.11911 19.0809 6.8554 32.4489 27.2287 31.5349C27.2287 31.5349 28.2474 40.2184 25.1914 41.2467C25.1914 41.2467 15.2311 27.1931 1.5357 36.2194C1.5357 36.2194 5.83674 51.4156 22.9277 47.4166C22.9277 47.4166 16.7025 58.3852 0.743408 61.0131L1.76208 64.3266C13.9861 62.9555 22.475 57.3569 26.6628 46.9595C37.8681 52.6724 45.9043 50.273 50.8844 39.7614C43.301 34.6198 35.944 35.1911 28.8133 41.361Z"
          fill="#D5AA6D"
        />
      </svg>
    ),
    image: "http://7oroof.com/demos/trust/images/practice-area-5-blog.jpg",
    heading: "Drug Offences",
    slug: "drug-offences",
    description:
      "The legal restrictions placed on the use of controlled drugs are aimed at preventing drug misuse. The principal offences are contained in the Misuse of Drugs Act 1971.",
  },
  {
    id: 6,
    svg: (
      <svg
        width="86"
        height="51"
        viewBox="0 0 86 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M73.7185 32.2725C79.9932 32.2725 85.4546 29.8681 85.4546 26.8975C85.4546 23.9269 79.9897 21.5225 73.7185 21.5225C67.4473 21.5225 61.9824 23.9269 61.9824 26.8975C61.9824 29.8681 67.4438 32.2725 73.7185 32.2725ZM73.9368 27.4744C73.2361 27.2594 71.0847 27.0767 71.0847 25.8619C71.0847 25.1847 71.8699 24.5791 73.3347 24.4429V23.9126H74.0882V24.4178C74.6375 24.4322 75.2502 24.4931 75.9298 24.6328L75.6551 25.4534C75.1375 25.3316 74.5601 25.2169 73.9932 25.2169L73.8241 25.2205C72.6938 25.2671 72.6023 25.9049 73.384 26.1773C74.6657 26.5786 76.3559 26.876 76.3559 27.9438C76.3559 28.7967 75.3382 29.2553 74.0847 29.3664V29.8896H73.3312V29.3915C72.5565 29.3843 71.7431 29.2553 71.0706 29.026L71.4157 28.2054C71.9896 28.3559 72.7079 28.5064 73.3593 28.5064L73.8488 28.4706C74.7185 28.3488 74.8911 27.7539 73.9368 27.4744ZM73.7185 46.6058C78.1587 46.6058 82.7679 45.4484 85.4546 43.259V44.8142C85.4546 47.7848 79.9897 50.2465 73.7185 50.2465C67.4473 50.2465 61.9824 47.7848 61.9824 44.8142V43.259C64.6691 45.452 69.2748 46.6058 73.7185 46.6058ZM73.7185 34.6626C78.1587 34.6626 82.7679 33.5052 85.4546 31.3158V32.8709C85.4546 35.8415 79.9897 38.2459 73.7185 38.2459C67.4473 38.2459 61.9824 35.8415 61.9824 32.8709V31.3158C64.6691 33.5052 69.2748 34.6626 73.7185 34.6626ZM73.7185 40.636C78.1587 40.636 82.7679 39.4786 85.4546 37.2856V38.8443C85.4546 41.8113 79.9897 44.2193 73.7185 44.2193C67.4473 44.2193 61.9824 41.8113 61.9824 38.8443V37.2856C64.6691 39.4786 69.2748 40.636 73.7185 40.636ZM43.9963 29.5671C43.9963 31.7207 42.3413 32.8709 40.299 33.1576V34.4798H39.0631V33.2257C37.7884 33.2042 36.468 32.896 35.3659 32.3155L35.9293 30.2551C37.1053 30.7173 38.6758 31.2118 39.9012 30.9323C41.3167 30.6063 41.6089 29.1228 40.0455 28.4061C38.8976 27.8686 35.387 27.3992 35.387 24.3426C35.387 22.6333 36.6652 21.1033 39.0631 20.7664V19.4298H40.299V20.7055C41.1899 20.727 42.1934 20.8883 43.3097 21.2323L42.8625 23.2963C41.9153 22.9594 40.8695 22.6513 39.8519 22.7158C38.0173 22.8268 37.8554 24.4429 39.1335 25.1202C41.2427 26.1307 43.9963 26.8796 43.9963 29.5671ZM64.3275 3.66317H4.46758V39.4965H0.946411V0.079834H64.3275V3.66317ZM7.98876 7.2465V46.6632H57.2852V26.8975C57.2852 20.4762 64.2747 17.1867 71.3699 16.5954V7.2465H7.98876ZM39.6793 39.4965C32.8729 39.4965 27.3552 33.8814 27.3552 26.9548C27.3552 20.0283 32.8729 14.4132 39.6793 14.4132C46.4857 14.4132 52.0034 20.0283 52.0034 26.9548C52.0034 33.8814 46.4857 39.4965 39.6793 39.4965Z"
          fill="currentColor"
        />
      </svg>
    ),
    image: "http://7oroof.com/demos/trust/images/practice-area-6-blog.jpg",
    heading: "Financial Law",
    slug: "financial-law",
    description:
      "The legal restrictions placed on the use of controlled drugs are aimed at preventing drug misuse. The principal offences are contained in the Misuse of Drugs Act 1971.",
  },
  {
    id: 7,
    svg: (
      <svg
        width="63"
        height="60"
        viewBox="0 0 63 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.9628 28.8226V50.4321C28.9628 51.6746 28.4792 52.7794 27.512 53.7485C26.545 54.7172 25.4406 55.2017 24.2011 55.2017C22.9614 55.2017 21.8578 54.7172 20.89 53.7485C19.9228 52.7794 19.4395 51.6744 19.4395 50.4321C19.4395 49.7864 19.2038 49.2277 18.7325 48.7556C18.2609 48.2839 17.7033 48.0477 17.0581 48.0477C16.4131 48.0477 15.855 48.2839 15.3835 48.7556C14.9125 49.2276 14.6768 49.7862 14.6768 50.4321C14.6768 53.0152 15.6191 55.2504 17.5041 57.1386C19.3889 59.0273 21.6216 59.9695 24.2009 59.9695C26.7799 59.9695 29.0124 59.0272 30.8973 57.1386C32.782 55.2504 33.7246 53.0152 33.7246 50.4321V28.8226C32.9059 28.5495 32.1122 28.4128 31.3434 28.4128C30.575 28.4128 29.7809 28.5495 28.9628 28.8226Z"
          fill="currentColor"
        />
        <path
          d="M33.7247 6.39304V2.74194C33.7247 2.09623 33.4885 1.53678 33.0176 1.06502C32.5467 0.593006 31.9884 0.356934 31.3434 0.356934C30.6987 0.356934 30.1409 0.593006 29.6694 1.06502C29.1981 1.5373 28.9626 2.09623 28.9626 2.74194V6.39304C30.004 6.34371 30.7978 6.31852 31.3434 6.31852C31.8891 6.31852 32.6831 6.34371 33.7247 6.39304Z"
          fill="currentColor"
        />
        <path
          d="M62.2578 29.5681C61.4391 26.1405 60.0065 23.017 57.9609 20.1977C55.9137 17.3784 53.5022 15.0557 50.7241 13.2302C47.947 11.4045 44.8901 9.99516 41.5542 9.00154C38.2187 8.00766 34.8145 7.51111 31.3422 7.51111C26.6296 7.51111 22.1595 8.35583 17.9307 10.0446C13.7018 11.7335 10.0063 14.2733 6.84439 17.6638C3.68205 21.0543 1.54272 25.0227 0.426924 29.5681C0.401775 29.6174 0.389526 29.7047 0.389526 29.8287C0.389526 30.1515 0.507191 30.4314 0.742911 30.6669C0.97863 30.9028 1.25748 31.0207 1.57985 31.0207C1.85297 31.0207 2.13794 30.8969 2.43556 30.6482C3.65064 29.5058 4.80409 28.6488 5.89539 28.0776C6.98695 27.5064 8.25181 27.2205 9.6901 27.2205C11.3768 27.2205 12.964 27.6805 14.4521 28.5994C15.9403 29.5181 17.2179 30.7231 18.284 32.2126C18.4579 32.4618 18.6749 32.8097 18.9353 33.2553C19.1959 33.7037 19.3759 34.0016 19.4749 34.1503C19.7476 34.5722 20.0951 34.7839 20.5165 34.7839C20.9631 34.7839 21.3226 34.5722 21.5955 34.1503C21.6946 34.0015 21.8746 33.7036 22.1348 33.2553C22.3954 32.8097 22.6125 32.4618 22.7859 32.2126C23.8521 30.7236 25.1234 29.5181 26.5993 28.5994C28.0749 27.6805 29.6561 27.2205 31.3426 27.2205C33.0291 27.2205 34.6103 27.68 36.0863 28.5994C37.5619 29.5181 38.8331 30.7231 39.899 32.2126C40.0737 32.4618 40.29 32.8097 40.5509 33.2553C40.8114 33.7037 40.9915 34.0016 41.0913 34.1503C41.3633 34.5722 41.7227 34.7839 42.1695 34.7839C42.5913 34.7839 42.9382 34.5722 43.2103 34.1503C43.3102 34.0015 43.4902 33.7036 43.7506 33.2553C44.0115 32.8097 44.2277 32.4618 44.4026 32.2126C45.4692 30.7236 46.7463 29.5181 48.2339 28.5994C49.7226 27.6801 51.3101 27.2205 52.9966 27.2205C54.4352 27.2205 55.6998 27.5063 56.7913 28.0775C57.8825 28.6487 59.0353 29.5057 60.2509 30.6481C60.5486 30.8972 60.8341 31.0205 61.107 31.0205C61.429 31.0205 61.7085 30.9027 61.9436 30.6667C62.179 30.4307 62.2967 30.1519 62.2967 29.8285C62.2958 29.7043 62.2842 29.6174 62.2578 29.5681Z"
          fill="currentColor"
        />
      </svg>
    ),
    image: "http://7oroof.com/demos/trust/images/practice-area-1-blog.jpg",
    heading: "Insurance",
    slug: "insurance",
    description:
      "The legal restrictions placed on the use of controlled drugs are aimed at preventing drug misuse. The principal offences are contained in the Misuse of Drugs Act 1971.",
  },
  {
    id: 8,
    svg: (
      <svg
        width="65"
        height="62"
        viewBox="0 0 65 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.30643 19.591H32.4419H58.5774V17.7861H63.5164V14.0702L32.4419 0.586914L1.47034 14.0702V17.7861H6.30643V19.591Z"
          fill="#D5AA6D"
        />
        <path
          d="M9.59911 21.9266V46.6637H6.20355V48.7871H4.24854V51.6536H60.6353V48.7871H58.6803V46.6637H55.5934V21.9266H46.6415V46.6637H43.246V21.9266H34.2941V46.6637H30.8985V21.9266H21.9466V46.6637H18.6539V21.9266H9.59911Z"
          fill="#D5AA6D"
        />
        <path
          d="M64.0308 53.9894H0.852905V61.7396H64.0308V53.9894Z"
          fill="#D5AA6D"
        />
      </svg>
    ),
    image: "http://7oroof.com/demos/trust/images/practice-area-2-blog.jpg",
    heading: "Civil Litigation",
    slug: "civil-litigation",
    description:
      "The legal restrictions placed on the use of controlled drugs are aimed at preventing drug misuse. The principal offences are contained in the Misuse of Drugs Act 1971.",
  },
];

export const copyrightNavigation = [
  {
    path: "#",
    name: "News",
  },
  {
    path: "/faqs",
    name: "FAQs",
  },
  {
    path: "#",
    name: "Careers",
  },
  {
    function: "pp",
    name: "Privacy Policy",
  },
  {
    function: "tos",
    name: "Terms of Service",
  },
];

export const jurisdiction = [
  {
    title: "Federal Government",
  },
  {
    title: "States",
  },
  {
    title: "District of Columbia",
  },
  {
    title: "Puerto Rico",
  },
  {
    title: "Guam",
  },
  {
    title: "U.S. Virgin Islands",
  },
  {
    title: "Northern Mariana Islands",
  },
  {
    title: "American Samoa",
  },
  {
    title: "Tribal Nations",
  },
];

export const aboutSkills = [
  {
    skill_title: "criminal law",
    progress: 75,
  },
  {
    skill_title: "Indurance",
    progress: 50,
  },
  {
    skill_title: "Financial Law",
    progress: 90,
  },
  {
    skill_title: "Civil Litigation",
    progress: 60,
  },
  {
    skill_title: "Other Areas",
    progress: 95,
  },
];

export const aboutCountdowns = [
  {
    count: 1000,
    title: "Qualified Lawyers",
    icon: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.75 36.4502C14.875 36.4502 6.75 28.3252 6.75 18.4502C6.75 8.5752 14.875 0.450195 24.75 0.450195C34.625 0.450195 42.75 8.5752 42.75 18.4502C42.75 28.3252 34.625 36.4502 24.75 36.4502ZM24.75 4.4502C17 4.4502 10.75 10.7002 10.75 18.4502C10.75 26.2002 17 32.4502 24.75 32.4502C32.5 32.4502 38.75 26.2002 38.75 18.4502C38.75 10.7002 32.5 4.4502 24.75 4.4502ZM46.75 36.4502V32.4502C52.25 32.4502 56.75 27.9502 56.75 22.4502C56.75 16.9502 52.25 12.4502 46.75 12.4502V8.4502C54.5 8.4502 60.75 14.7002 60.75 22.4502C60.75 30.2002 54.5 36.4502 46.75 36.4502ZM64.75 60.4502H52.75V56.4502H60.125L58.625 46.0752L52.25 44.3252L53.25 40.4502L62.25 42.8252L64.75 60.4502ZM49 64.4502H0.5L3 43.5752L12.375 40.5752L13.625 44.3252L6.625 46.5752L5 60.4502H44.5L42.875 46.5752L35.875 44.3252L37.125 40.5752L46.5 43.5752L49 64.4502Z"
          fill="#D5AA6D"
        />
      </svg>
    ),
  },
  {
    count: 32154,
    title: "Trusted Clients",
    icon: (
      <svg
        width="64"
        height="61"
        viewBox="0 0 64 61"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M64 60.4502H0V34.4502H64V60.4502ZM4 56.4502H60V38.4502H4V56.4502ZM32 44.4502C28.75 44.4502 26 41.7002 26 38.4502H30C30 39.5752 30.875 40.4502 32 40.4502C33.125 40.4502 34 39.5752 34 38.4502H38C38 41.7002 35.25 44.4502 32 44.4502ZM46 14.4502H38V10.4502C38 7.2002 35.25 4.4502 32 4.4502C28.75 4.4502 26 7.2002 26 10.4502V14.4502H18V10.4502H22C22 4.9502 26.5 0.450195 32 0.450195C37.5 0.450195 42 4.9502 42 10.4502H46V14.4502ZM64 30.4502H60V22.4502H4V30.4502H0V18.4502H64V30.4502Z"
          fill="#D5AA6D"
        />
      </svg>
    ),
  },
  {
    count: 114586,
    title: "Successful Cases",
    icon: (
      <svg
        width="64"
        height="61"
        viewBox="0 0 65 61"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50.5 28.4502C42.75 28.4502 36.5 22.2002 36.5 14.4502H40.5C40.5 19.9502 45 24.4502 50.5 24.4502C56 24.4502 60.5 19.9502 60.5 14.4502C60.5 8.9502 56 4.4502 50.5 4.4502H14.5C9 4.4502 4.5 8.9502 4.5 14.4502C4.5 19.9502 9 24.4502 14.5 24.4502C20 24.4502 24.5 19.9502 24.5 14.4502H28.5C28.5 22.2002 22.25 28.4502 14.5 28.4502C6.75 28.4502 0.5 22.2002 0.5 14.4502C0.5 6.7002 6.75 0.450195 14.5 0.450195H50.5C58.25 0.450195 64.5 6.7002 64.5 14.4502C64.5 22.2002 58.25 28.4502 50.5 28.4502ZM28.5 24.4502H36.5V28.4502H28.5V24.4502ZM12.5 32.4502H16.5V60.4502H12.5V32.4502ZM24.5 32.4502H28.5V60.4502H24.5V32.4502ZM36.5 32.4502H40.5V60.4502H36.5V32.4502ZM48.5 32.4502H52.5V60.4502H48.5V32.4502ZM12.625 14.4502H8.625C8.625 11.2002 11.375 8.4502 14.625 8.4502V12.4502C13.5 12.4502 12.625 13.3252 12.625 14.4502ZM48.625 14.4502H44.625C44.625 11.2002 47.375 8.4502 50.625 8.4502V12.4502C49.5 12.4502 48.625 13.3252 48.625 14.4502Z"
          fill="#D5AA6D"
        />
      </svg>
    ),
  },
  {
    count: 2000,
    title: "Honors & Awards",
    icon: (
      <svg
        width="45"
        height="65"
        viewBox="0 0 45 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.25 64.4502C13.375 64.4502 6.25 57.3252 6.25 48.4502C6.25 39.5752 13.375 32.4502 22.25 32.4502C31.125 32.4502 38.25 39.5752 38.25 48.4502C38.25 57.3252 31.125 64.4502 22.25 64.4502ZM22.25 36.4502C15.625 36.4502 10.25 41.8252 10.25 48.4502C10.25 55.0752 15.625 60.4502 22.25 60.4502C28.875 60.4502 34.25 55.0752 34.25 48.4502C34.25 41.8252 28.875 36.4502 22.25 36.4502ZM18.25 48.4502H14.25C14.25 44.0752 17.875 40.4502 22.25 40.4502V44.4502C20 44.4502 18.25 46.2002 18.25 48.4502ZM24.875 28.3252L23.625 24.5752L40 19.0752L38.25 10.4502V4.4502H6.25V10.8252L4.5 19.0752L20.875 24.5752L19.625 28.3252L0 21.8252L2.25 10.2002V0.450195H42.25V10.2002L44.5 21.8252L24.875 28.3252ZM14.25 8.4502H18.25V16.4502H14.25V8.4502ZM26.25 8.4502H30.25V16.4502H26.25V8.4502Z"
          fill="#D5AA6D"
        />
      </svg>
    ),
  },
];

export const clientCarouselData = [
  {
    image: client_1,
  },
  {
    image: client_2,
  },
  {
    image: client_3,
  },
  {
    image: client_4,
  },
  {
    image: client_5,
  },
  {
    image: client_6,
  },
  {
    image: client_1,
  },
  {
    image: client_2,
  },
];

export const terms_of_service = `

<p>Welcome to our platform, provided by <b>The MDX Lawsuit Inc.</b> ("we," "us," or "our"). Please read these terms of service (the "ToS") carefully. By using our platform, you agree to these ToS.</p>

<ul>
  <li>
    <h3>YOUR USE OF THE PLATFORM</h3>
    <p>You may use our platform only for lawful purposes and in accordance with these ToS. You agree not to use our platform:</p>
      <ul>
        <li>In any way that violates any applicable federal, state, local or international law or regulation.</li>
        <li>To engage in any activity that may harm or interfere with the proper functioning of our platform.</li>
        <li>To engage in any fraudulent, deceptive or misleading activity.</li>
      </ul>
  </li>

  <li>
    <h3>PRIVACY POLICY</h3>
    <p>We value your privacy and have established a privacy policy that describes how we collect, use and share your personal information. By using our platform, you agree to the terms of our privacy policy.</p>
  </li>

  <li>
    <h3>ACCOUNTS AND REGISTRATION</h3>
    <p>To use our platform, you may be required to create an account and provide us with certain personal information. You agree that the information you provide is accurate and complete, and you will promptly update any changes to your information. You are responsible for maintaining the confidentiality of your account login information.</p>
  </li>

  <li>
    <h3>INTELLECTUAL PROPERTY</h3>
    <p>Our platform and all content and materials included on our platform, such as text, graphics, logos, images, audio clips, video, data, music, software, and other material (collectively, "<b>Content</b>"), are owned by us or our licensors and are protected by intellectual property laws.</p>
  </li>

  <li>
    <h3>DISCLAIMER OF WARRANTIES</h3>
    <p>THE PLATFORM IS PROVIDED "<b>AS IS</b>," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY WARRANTY FOR INFORMATION, SERVICES, UNINTERRUPTED ACCESS, OR PRODUCTS PROVIDED THROUGH OR IN CONNECTION WITH THE PLATFORM, INCLUDING WITHOUT LIMITATION THE SOFTWARE LICENSED TO YOU AND THE RESULTS OBTAINED THROUGH THE PLATFORM. SPECIFICALLY, WE DISCLAIM ANY AND ALL WARRANTIES, INCLUDING WITHOUT LIMITATION: 1) ANY WARRANTIES CONCERNING THE AVAILABILITY, ACCURACY, USEFULNESS, OR CONTENT OF INFORMATION, PRODUCTS OR SERVICES, AND 2) ANY WARRANTIES OF TITLE, WARRANTY OF NON-INFRINGEMENT, WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.</p>
  </li>

  <li>
    <h3>LIMITATION OF LIABILITY</h3>
    <p>IN NO EVENT SHALL WE OR OUR AFFILIATES BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT DAMAGES ARISING FROM YOUR USE OF THE PLATFORM OR YOUR RELIANCE ON ANY CONTENT. <b>The MDX Lawsuit INC. IS NOT A LAW FIRM AND WE DO NOT PROVIDE LEGAL ADVICE.</b></p>
  </li>

  <li>
    <h3>TERMINATION</h3>
    <p>We may terminate your access to and use of the platform at any time, for any reason or for no reason.</p>
  </li>

  <li>
    <h3>CHANGES TO THESE TERMS</h3>
    <p>We reserve the right to modify these ToS at any time. Your continued use of the platform after any such modification constitutes your acceptance of the new ToS.</p>
  </li>

  <li>
    <h3>GOVERNING LAW AND JURISDICTION</h3>
    <p>These ToS and your use of the platform will be governed by and construed in accordance with the laws of the state of [state], without giving effect to any choice of law or conflict of law provisions.</p>
  </li>
</ul>

<p>If you have any questions about these ToS, please contact us at [contact information].</p>`;

export const privacy_policy = `

<p>At The MDX Lawsuit Inc. ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and disclose information about you when you use our platform.</p>

<ol>
  <li>
    <h3>INFORMATION WE COLLECT</h3>
    <p>We may collect the following information about you:</p>
    <ul>
      <li>Personal information, such as your name, email address, phone number, and billing information</li>
      <li>Information you provide to us, such as messages, support inquiries, or feedback</li>
      <li>Information automatically collected when you use our platform, such as your IP address, device type, and browsing behavior</li>
      <li>Usage information, such as the pages you visit and features you use on our platform</li>
      <li>Information collected from third-party sources, such as social media platforms or marketing partners</li>
      <li>Information regarding the costs you are charged by lawyers</li>
    </ul>
  </li>

  <li>
    <h3>HOW WE USE YOUR INFORMATION</h3>
    <p>We may use your information for the following purposes:</p>
    <ul>
      <li>To provide and maintain our platform</li>
      <li>To communicate with you about your account and our services</li>
      <li>To personalize and improve your experience on our platform</li>
      <li>To measure the performance of our platform and diagnose technical issues</li>
      <li>To market and promote our services to you</li>
      <li>To comply with legal obligations and enforce our policies</li>
      <li>To develop an open market where pricing information is readily available</li>
    </ul>
  </li>

  <li>
    <h3>HOW WE SHARE YOUR INFORMATION</h3>
    <p>We may share your information with the following parties:</p>
    <ul>
      <li>Service providers who help us operate our platform and provide our services</li>
      <li>Marketing partners who help us promote our services to you</li>
      <li>Law enforcement or other third parties if we believe it is necessary to comply with legal obligations, protect our rights or the rights of others, or prevent fraud or other illegal activity</li>
    </ul>
  </li>

  <li>
    <h3>COOKIES AND SIMILAR TECHNOLOGIES</h3>
    <p>We use cookies and similar technologies to collect information about your use of our platform. You can choose to disable cookies in your browser settings, but this may impact your ability to use our platform.</p>
  </li>

  <li>
    <h3>DATA RETENTION AND SECURITY</h3>
    <p>We retain your information for as long as necessary to provide our services to you and as required by law. We use reasonable security measures to protect your information from unauthorized access or disclosure.</p>
  </li>

  <li>
    <h3>YOUR RIGHTS</h3>
    <p>You have certain rights with respect to your personal information, including the right to access, correct, or delete your information. To exercise your rights, please contact us using the information below.</p>
  </li>

  <li>
    <h3>CHANGES TO THIS PRIVACY POLICY</h3>
    <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the new privacy policy on our platform.</p>
  </li>

  <li>
    <h3>CONTACT US</h3>
    <p>If you have any questions or concerns about our privacy policy or our use of your information, please contact us at [contact information].</p>
  </li>
</ol>

<p>Thank you for reading our privacy policy.</p>`;

export const role_for_register = `
<p>Wanna Register as :</p>

<div>
      <label>
        <input
          type='radio'
          name='userType'
          value='lawyer'
          checked={selectedOption === 'lawyer'}
          onChange={handleOptionChange}
        />
        Lawyer
      </label>
      <br />
      <label>
        <input
          type='radio'
          name='userType'
          value='client'
          checked={selectedOption === 'client'}
          onChange={handleOptionChange}
        />
        Client
      </label>
      <br />
      <button disabled={!selectedOption}>Submit</button>
    </div>


`;

export const search_pages = [
  {
    label: "Home",
    value: "/",
    description: "localhost:3000/",
    path: "/",
  },

  {
    label: "About",
    value: "/about-us",
    description: "localhost:3000/about-us",
    path: "/about-us",
  },
  {
    label: "Practice Area ",
    value: "/practice-areas",
    description: "localhost:3000/practice-areas",
    path: "/practice-areas",
  },
  {
    label: "Attorneys ",
    value: "/legal-professionals",
    description: "localhost:3000/legal-professionals",
    path: "/practice-areas",
  },
  {
    label: "Contact ",
    value: "/contact-us",
    description: "localhost:3000/contact-us",
    path: "/contact-us",
  },
  {
    label: "FAQs ",
    value: "/faqs",
    description: "localhost:3000/faqs",
    path: "/faqs",
  },
];

export const lawyer_search_pages = [
  {
    label: "Home",
    value: "/",
    description: "localhost:3000/",
    path: "/",
  },

  {
    label: "About",
    value: "/about-us",
    description: "localhost:3000/about-us",
    path: "/about-us",
  },
  {
    label: "Practice Area ",
    value: "/practice-areas",
    description: "localhost:3000/practice-areas",
    path: "/practice-areas",
  },
  {
    label: "Attorneys ",
    value: "/legal-professionals",
    description: "localhost:3000/legal-professionals",
    path: "/practice-areas",
  },
  {
    label: "Contact ",
    value: "/contact-us",
    description: "localhost:3000/contact-us",
    path: "/contact-us",
  },
  {
    label: "FAQs ",
    value: "/faqs",
    description: "localhost:3000/faqs",
    path: "/faqs",
  },
  {
    label: "Dashboard ",
    value: "/lawyer/dashboard",
    description: "localhost:3000/lawyer/dashboard",
    path: "/lawyer/dashboard",
  },
  {
    label: "Time Slot ",
    value: "/dashboard/time-slot",
    description: "localhost:3000/dashboard/time-slot",
    path: "/dashboard/time-slot",
  },
  {
    label: "Setting",
    value: "/dashboard/account-settings",
    description: "localhost:3000/dashboard/account-settings",
    path: "/dashboard/account-settings",
  },
  {
    label: "Profile",
    value: "/lawyer-profile",
    description: "localhost:3000/lawyer-profile",
    path: "/lawyer-profile",
  },
];

export const client_search_pages = [
  {
    label: "Home",
    value: "/",
    description: "localhost:3000/",
    path: "/",
  },

  {
    label: "About",
    value: "/about-us",
    description: "localhost:3000/about-us",
    path: "/about-us",
  },
  {
    label: "Practice Area ",
    value: "/practice-areas",
    description: "localhost:3000/practice-areas",
    path: "/practice-areas",
  },
  {
    label: "Attorneys ",
    value: "/legal-professionals",
    description: "localhost:3000/legal-professionals",
    path: "/practice-areas",
  },
  {
    label: "Contact ",
    value: "/contact-us",
    description: "localhost:3000/contact-us",
    path: "/contact-us",
  },
  {
    label: "FAQs ",
    value: "/faqs",
    description: "localhost:3000/faqs",
    path: "/faqs",
  },
  {
    label: "Dashboard ",
    value: "/client/dashboard",
    description: "localhost:3000/client/dashboard",
    path: "/client/dashboard",
  },
  {
    label: "Consultation ",
    value: "/dashboard/consultation",
    description: "localhost:3000/dashboard/consultation",
    path: "/dashboard/consultation",
  },
  {
    label: "Setting",
    value: "/dashboard/account-settings",
    description: "localhost:3000/dashboard/account-settings",
    path: "/dashboard/account-settings",
  },
  {
    label: "Profile",
    value: "/client-profile",
    description: "localhost:3000/client-profile",
    path: "/client-profile",
  },
];

export const lawyerAsideNavigation = [
  {
    icon: AiOutlineAppstore,
    link: "/lawyer/dashboard",
    label: "Dashboard",
  },
  {
    icon: AiOutlineSetting,
    link: "/lawyer/account-settings",
    label: "Account Settings",
  },
  {
    icon: MdEventAvailable,
    link: "/lawyer/appointments",
    label: "Appointments",
  },
  {
    icon: HiClipboardDocumentList,
    link: "/lawyer/contracts",
    label: "Contracts",
  },
  {
    icon: FaWallet,
    link: "/lawyer/wallet",
    label: "Wallet",
  },
];

export const clientAsideNavigation = [
  {
    icon: AiOutlineAppstore,
    link: "/client/dashboard",
    label: "Dashboard",
  },
  {
    icon: AiOutlineSetting,
    link: "/client/account-settings",
    label: "Account Settings",
  },
  {
    icon: MdEventAvailable,
    link: "/client/appointments",
    label: "Appointments",
  },
  {
    icon: HiClipboardDocumentList,
    link: "/client/contracts",
    label: "Contracts",
  },
];

export const adminAsideNavigation = [
  {
    icon: <FaLayerGroup />,
    label: "Dashboard",
    path: "/admin/dashboard",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <FaUserCircle />,
    label: "Manage Profile",
    path: "/admin/account-settings",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <FaUsers />,
    label: "Manage Users",
    path: "/admin/users",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <FaLandmark />,
    label: "Jurisdictions",
    path: "/admin/jurisdictions",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <BiWorld />,
    label: "Countries",
    path: "/admin/countries",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <FaChessQueen />,
    label: "Areas of practice",
    path: "/admin/practice-areas",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <HiClipboardDocumentList />,
    label: "Contracts",
    path: "/admin/contracts",
    allow: ["superadmin"],
  },
  {
    icon: <GrContact />,
    label: "Messages",
    path: "/admin/messages",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <SlEnvolopeLetter />,
    label: "Newsletter",
    path: "/admin/newsletter",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <CgWebsite />,
    label: "Site Settings",
    path: "/admin/settings/site",
    allow: ["superadmin"],
  },
  {
    icon: <PiSlideshow />,
    label: "Carousel Settings",
    path: "/admin/settings/carousel",
    allow: ["admin", "superadmin"],
  },
  {
    icon: <BiMoneyWithdraw />,
    label: "Withdraw Requests",
    path: "/admin/withdraw-requests",
    allow: ["superadmin"],
  },
  {
    icon: <AiFillQuestionCircle />,
    label: "Manage FAQs",
    path: "/admin/faqs",
    allow: ["admin", "superadmin"],
  },
];
