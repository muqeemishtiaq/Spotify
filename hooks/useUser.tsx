"use client";
import { Subscription, UserDetails } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import {
  useSession,
  useSessionContext,
  useUser as useSupaUser,
} from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  userDetails: UserDetails | null;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();

  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const getUserDetails = () => supabase.from("users").select("*").single();
  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        ([userDetailsResult, subscriptionResult]) => {
          if (userDetailsResult.status === "fulfilled") {
            setUserDetails(userDetailsResult.value.data as UserDetails);
          }
          if (subscriptionResult.status === "fulfilled") {
            setSubscription(subscriptionResult.value.data as Subscription);
          }
          setIsLoadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser, isLoadingData, userDetails, subscription]);

  const value = {
    accessToken,
    user,
    isLoading: isLoadingUser || isLoadingData,
    userDetails,
    subscription,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a MyUserContextProvider");
  }
  return context;
};