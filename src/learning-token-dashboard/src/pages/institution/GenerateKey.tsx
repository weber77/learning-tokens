import { useEffect, useState } from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";

import { MdCancel } from "react-icons/md";
import {
  useLazyGenerateSdkKeyInstitutionQuery,
  useLazyGetSdkKeyInstitutionQuery,
} from "../../store/features/institution/institutionApi";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { copyCode } from "@/lib/utils";

const GenerateKey = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const [copy, setCopy] = useState("");
  const [status, setStatus] = useState(false);
  const [generateSdkKeyInstitution, { isLoading }] =
    useLazyGenerateSdkKeyInstitutionQuery();
  const [getSdkKeyInstitution] = useLazyGetSdkKeyInstitutionQuery();

  useEffect(() => {
    if (auth && auth.user) {
      getSdkKeyInstitution(auth.user.id)
        .unwrap()
        .then((res: any) => {
          setCopy(res.result);
        });
    }
  }, [auth]);

  const generate = () => {
    try {
      if (auth && auth.user) {
        generateSdkKeyInstitution(auth.user.id)
          .unwrap()
          .then((res: any) => {
            setStatus(true);
            setCopy(res.result);
            toast.success("API key generated!");
          });
      }
    } catch (error) {}
  };

  return (
    <div className="bg-white p-5 border border-slate-200/60 shadow-md shadow-slate-200/30 rounded-lg">
      <h2 className="text-slate-900 font-semibold text-xl mb-3 dark:text-gray-400">
        Generate an API key for your application
      </h2>
      <p>
        To connect securely to the API service, your application or tool needs
        an API key with permission to access the resource
      </p>
      {status && (
        <div className="flex my-4 bg-green-100 gap-4 w-fit relative before:absolute before:h-full before:w-1 before:bg-green-500 overflow-hidden rounded-md">
          <div className="ml-4 pt-4">
            <BsFillCheckCircleFill className="text-green-400 h-5 w-auto" />
          </div>
          <div className="py-4">
            <div className="font-bold">API key successfully generated</div>
            <p className="py-2">
              Configure your application with the credentials. A secret has been
              created to store your credentials
            </p>
          </div>
          <div
            className="pt-4 mr-3 cursor-pointer"
            onClick={() => setStatus(false)}
          >
            <MdCancel className="h-5 w-auto text-[#013A44]" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mt-4">
        <div className="w-[700px] p-4 rounded ">
          <div className="flex items-center justify-between gap-2">
            <Input
              className="w-full cursor-default bg-transparent outline-none"
              type="text"
              value={copy}
              readOnly
            />
            <Copy
              onClick={() => copyCode(copy)}
              className="group-hover:text-slate-400"
            />
          </div>
        </div>
        <Button
          className="bg-[#013A44] text-white p-5 cursor-pointer rounded"
          onClick={generate}
        >
          {isLoading ? "Generating" : "Generate"} API key
        </Button>
      </div>
    </div>
  );
};

export default GenerateKey;
