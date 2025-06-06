import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [userMembershipType, setUserMembershipType] = useState("");
  const [premiumExpiryDate, setPremiumExpiryDate] = useState("");

  const tiers = [
    {
      name: "Silver",
      price: "Rs.25 for 3 months",
      benefits: [
        "Access to share posts as locked", 
        "Allow friends to view locked posts"
      ],
      color: "bg-gray-300 text-black",
    },
    {
      name: "Gold",
      price: "Rs.50 for 3 months",
      benefits: [
        "Access to all features of Silver",
        "Access to Account Analytics", 
        "Access to Dashboard"
      ],
      color: "bg-yellow-400 text-black",
    },
    {
      name: "Platinum",
      price: "Rs.100 for 3 months",
      benefits: [
        "Access to all features of Silver",
        "Access to all features of Gold",
        "Access to profile viewers"
      ],
      color: "bg-gradient-to-r from-blue-500 to-purple-500 text-black",
    },
  ];

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", { withCredentials: true });
      console.log("User premium verification response:", res.data);
      if (res.data?.isPremium) {
        setIsUserPremium(true);
        setUserMembershipType(res.data?.membershipType);
        setPremiumExpiryDate(res.data?.premiumExpiryDate);
      }
    } catch (err) {
      console.log("Error in verifying premium user:", err);
    }
  };

  const handleChoosePlan = async (tier) => {
    try {
      const order = await axios.post(BASE_URL + "/payment/create", { tier }, { withCredentials: true });
      const { amount, keyId, orderId, currency, notes } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "BuddyBeat",
        description: "BuddyBeat Premium Membership",
        image: "/logo.png",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId
        },
        theme: { color: "#3399cc" },
        handler: verifyPremiumUser
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log("Error in creating order:", err);
    }
  };

  const tiersToRender = isUserPremium
    ? tiers.filter(tier => tier.name !== userMembershipType)
    : tiers;

  return (
    <div className="p-6">
      {isUserPremium && (
      <div className="flex flex-col md:flex-row gap-6 items-start bg-green-300 backdrop-blur-md border border-white/30 rounded-xl shadow-md p-6 mb-6">
        
        {/* Left Side */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-2xl font-bold">You are a premium member 🎉</h1>
          <p className="text-lg font-semibold">Membership Type: {userMembershipType}</p>
          <p className="text-lg font-semibold">Expires on: {premiumExpiryDate}</p>
          <p className="text-sm text-gray-700">
            Note: You can still explore and upgrade to other plans below.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1 bg-white bg-opacity-60 rounded-lg p-4 shadow-inner">
          <p className="text-base font-medium underline mb-2 text-center md:text-left">Your Plan Benefits:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
            {tiers
              .find((tier) => tier.name === userMembershipType)
              ?.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
          </ul>
        </div>
      </div>
    )}

      <div className="flex flex-wrap justify-center gap-6">
        {tiersToRender.map((tier, index) => (
          <div
            key={index}
            className={`w-80 rounded-2xl shadow-lg flex flex-col justify-between ${tier.color}`}
          >
            <div className="p-6 flex flex-col h-full min-h-[340px]">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">{tier.name}</h2>
                <p className="text-lg font-medium">{tier.price}</p>
              </div>

              <ul className="flex-1 overflow-y-auto max-h-32 text-sm list-disc list-inside space-y-2 px-2 scrollbar-thin scrollbar-thumb-gray-400">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="break-words">{benefit}</li>
                ))}
              </ul>

              <div className="mt-6 text-center">
                <button
                  onClick={() => handleChoosePlan(tier)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
                >
                  Choose Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;
