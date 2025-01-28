import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {

    useEffect(() => {
        verifyPremiumUser();
        }, []);

  const [isUserPremium, setIsUserPremium] = useState(false);
  const [userMembershipType, setUserMembershipType] = useState("");

  const tiers = [
    {
      name: "Silver",
      price: "Rs.20/month",
      benefits: ["Basic Support", "Access to Community"],
      color: "bg-gray-300",
    },
    {
      name: "Gold",
      price: "Rs.50/month",
      benefits: ["Priority Support", "Exclusive Content"],
      color: "bg-yellow-400",
    },
    {
      name: "Platinum",
      price: "Rs.100/month",
      benefits: ["24/7 Support", "All Access Pass"],
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
    },
  ];

  const verifyPremiumUser = async () => {
    try{
        const res = await axios.get(BASE_URL + "/premium/verify", {withCredentials: true});

        if(res.data.isPremium){
            setIsUserPremium(true);
            setUserMembershipType(res.data.membershipType);
        }
    }catch(err){
        console.log("Error in verifying premium user: "+ err);
    }
    }

  const handleChoosePlan = async (tier) => {
    try{
        console.log("Chose plan: ", tier);
        const order = await axios.post(BASE_URL + "/payment/create", {tier}, {withCredentials: true});
        const {amount, keyId, orderId, currency, notes} = order.data;

        const options = {
            key: keyId,
            amount: amount,
            currency: currency,
            name: "BuddyBeat",
            description: "BuddyBeat Premium Membership",
            image: "/logo.png",
            order_id: orderId,
            prefill: {
                name: notes.firstName + " " + notes.lastName,
                email: notes.emailId
            },
            theme: {
                color: "#3399cc"
            },
            handler: verifyPremiumUser
        }
        // it should open the razorpay payment gateway dialog box
        const rzp = new window.Razorpay(options);
        rzp.open();
        }catch(err){
            console.log("Error in creating order: "+ err);
        }
    }

    const remainingTiers = tiers.filter(tier => tier.name !== userMembershipType);

  return isUserPremium ? 
  <div>
  <div style={{
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
  }}> You are already a premium member.
  <div className="text-center space-y-2">
      <p className="text-lg font-semibold">Subscription Details:</p>
      <p className="text-lg font-normal">Membership type: {userMembershipType}</p>
    </div>
    <br />
    <p className="text-lg font-normal">Note: You can try using below membership plans.</p>
    </div>
    <div className="flex flex-wrap justify-center gap-6 p-6">
    {remainingTiers.map((tier, index) => (
      <div key={index} className={`card w-80 shadow-xl ${tier.color}`}>
        <div className="card-body text-center">
          <h2 className="card-title text-2xl font-bold">{tier.name}</h2>
          <p className="text-xl font-semibold">{tier.price}</p>
          <ul className="mt-4 space-y-2">
            {tier.benefits.map((benefit, idx) => (
              <li key={idx} className="text-sm">
                {benefit}
              </li>
            ))}
          </ul>
          <div className="card-actions justify-center mt-4">
            <button onClick={() => handleChoosePlan(tier)} className="btn btn-primary">Choose Plan</button>
          </div>
        </div>
      </div>
    ))}
  </div> 
  </div>: 
  ( <div className="flex flex-wrap justify-center gap-6 p-6">
      {tiers.map((tier, index) => (
        <div key={index} className={`card w-80 shadow-xl ${tier.color}`}>
          <div className="card-body text-center">
            <h2 className="card-title text-2xl font-bold">{tier.name}</h2>
            <p className="text-xl font-semibold">{tier.price}</p>
            <ul className="mt-4 space-y-2">
              {tier.benefits.map((benefit, idx) => (
                <li key={idx} className="text-sm">
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="card-actions justify-center mt-4">
              <button onClick={() => handleChoosePlan(tier)} className="btn btn-primary">Choose Plan</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Premium;
