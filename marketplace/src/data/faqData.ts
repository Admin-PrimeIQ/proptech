import { IFAQItemDT } from "@/types/custom-interface";

export const faqItemsData: IFAQItemDT[] = [
    {
      id: "flush-collapseOne",
      question: "What services do you provide?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isOpen: false,
    },
    {
      id: "flush-collapseTwo",
      question: "Can I get a refund for my Premium Membership?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isOpen: true,
    },
    {
      id: "flush-collapseThree",
      question: "How does the Affiliate Program work?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isOpen: false,
    },
    {
      id: "flush-collapseFour",
      question: "What is included in the Standard membership plan?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isOpen: false,
    },
  ];
  
 export const faqItemsDataTwo: IFAQItemDT[] = [
    {
        id: 'flush-collapseOne',
        question: 'What services do you provide?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        id: 'flush-collapseTwo',
        question: 'Can I get a refund for my Premium Membership?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isOpen: true,
    },
    {
        id: 'flush-collapseThree',
        question: 'How does the Affiliate Program work?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        id: 'flush-collapseFour',
        question: 'What is included in Standard membership plan?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
];

//Faq page items
interface FaqTab {
  id: string;
  label: string;
  content: FaqItem[];
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqTabItemsTwo: FaqTab[] = [
  {
    id: "general",
    label: "General questions",
    content: [
      {
        id: "q1",
        question: "What services do you provide?",
        answer:
          "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market, it may take several weeks to a few months.",
      },
      {
        id: "q2",
        question: "Can I get a refund for my Premium Membership?",
        answer:
          "The time it takes to sell a home varies, but the average duration is influenced by factors ike market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
      },
      {
        id: "q3",
        question: "How does th Affiliate Program work?",
        answer:
          "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
      },
      {
        id: "q4",
        question: "What is included in Standard membership plan?",
        answer:
          "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
      },
    ],
  },
  {
    id: "listing",
    label: "Listing your property",
    content: [
        {
            id: "q5",
            question: "What services do you provide?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market, it may take several weeks to a few months.",
          },
          {
            id: "q6",
            question: "Can I get a refund for my Premium Membership?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors ike market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
          {
            id: "q7",
            question: "How does th Affiliate Program work?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
          {
            id: "q8",
            question: "What is included in Standard membership plan?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
    ],
  },
  {
    id: "listingTwo",
    label: "Upgrading your listing",
    content: [
        {
            id: "q5",
            question: "What services do you provide?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market, it may take several weeks to a few months.",
          },
          {
            id: "q6",
            question: "Can I get a refund for my Premium Membership?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors ike market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
          {
            id: "q7",
            question: "How does th Affiliate Program work?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
          {
            id: "q8",
            question: "What is included in Standard membership plan?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
    ],
  },
  {
    id: "support",
    label: "Technical support",
    content: [
        {
            id: "q5",
            question: "What services do you provide?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market, it may take several weeks to a few months.",
          },
          {
            id: "q6",
            question: "Can I get a refund for my Premium Membership?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors ike market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
          {
            id: "q7",
            question: "How does th Affiliate Program work?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
          {
            id: "q8",
            question: "What is included in Standard membership plan?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
    ],
  },
  {
    id: "contact",
    label: "Contact us",
    content: [
        {
            id: "q5",
            question: "What services do you provide?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market, it may take several weeks to a few months.",
          },
          {
            id: "q6",
            question: "Can I get a refund for my Premium Membership?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors ike market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
          {
            id: "q7",
            question: "How does th Affiliate Program work?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
          {
            id: "q8",
            question: "What is included in Standard membership plan?",
            answer:
              "The time it takes to sell a home varies, but the average duration is influenced by factors like market conditions, pricing, and property location. In a balanced market it may take several weeks to a few months.",
          },
    ],
  },
];