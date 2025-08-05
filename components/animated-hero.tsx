import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ["faster", "easier", "smarter"], []);

  const router = useRouter();
  function handleLocalAgent() {
    router.push("/run");
  }
  function handleRemoteAgent() {
    toast("Connect with remote agent is not supported yet");
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-4 cursor-pointer"
            >
              <a
                href="https://github.com/volcengine/veadk-python"
                target="_blank"
                className="flex items-center gap-3"
              >
                Browse v0.1.0 <MoveRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
          <div className="flex gap-6 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-full tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">
                Volcengine Agent Development Kit
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-full text-center">
              An agent development and cloud platform
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button
              size="lg"
              className="gap-4 cursor-pointer"
              onClick={handleLocalAgent}
            >
              Local agent
            </Button>
            <Button
              size="lg"
              className="gap-4 cursor-pointer"
              variant="outline"
              onClick={handleRemoteAgent}
            >
              Connect with remote agent <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
