"use client";

import { Dispatch, SetStateAction } from "react";
import { Box, Checkbox, FormControlLabel, useMediaQuery } from "@mui/material";
import {
  useTheme,
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import { useState } from "react";
import Header from "@/app/components/common/Header/Header";
import ArtworkDisplay from "@/app/components/ArtworkDisplay";
import ArtworkDetails from "@/app/components/common/ArtworkDetails/ArtworkDetails";
import ImageUploadButton from "@/app/components/ImageUploadButton";
import ArtworkTitle from "@/app/components/ArtworkTitle";
import TeacherBadge from "@/app/components/TeacherBadge";
import InstructorBadge from "@/app/components/InstructorBadge";
import GeininBadge from "@/app/components/GeininBadge";

const baseTheme = responsiveFontSizes(
  createTheme({
    typography: { fontSize: 14 },
  })
);

const characters = [
  { name: "teacher" },
  { name: "geinin" },
  { name: "instructor" },
] as const;

interface CharacterSelectionProps {
  setCharacter: Dispatch<SetStateAction<string>>;
  setWaitingForUser: Dispatch<SetStateAction<boolean>>;
  setImageBase64: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setFeature: Dispatch<SetStateAction<string>>;
  setAdvantage: Dispatch<SetStateAction<string>>;
  setAdvice: Dispatch<SetStateAction<string>>;
  snsCheck: boolean;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  setCharacter,
  setWaitingForUser,
  setImageBase64,
  setTitle,
  setFeature,
  setAdvantage,
  setAdvice,
  snsCheck,
}) => (
  <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
    {characters.map(({ name }) => (
      <ImageUploadButton
        key={name}
        character={name}
        snsCheck={snsCheck}
        setImageBase64={setImageBase64}
        setTitle={setTitle}
        setFeature={setFeature}
        setAdvantage={setAdvantage}
        setAdvice={setAdvice}
        onClick={() => {
          setCharacter(name);
          setWaitingForUser(false);
        }}
      />
    ))}
  </Box>
);

export default function Home() {
  const [title, setTitle] = useState("");
  const [feature, setFeature] = useState("");
  const [advantage, setAdvantage] = useState("");
  const [advice, setAdvice] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [snsCheck, setSnsCheck] = useState(true);
  const [character, setCharacter] = useState("");
  const [waitingForUser, setWaitingForUser] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={baseTheme}>
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            height: isMobile ? "auto" : "calc(100vh - 64px)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: isMobile ? "none" : "0 0 60%",
              width: isMobile ? "100%" : "auto",
              height: isMobile ? "auto" : "100%",
              position: "relative",
              paddingRight: isMobile ? 0 : "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArtworkDisplay imageBase64={imageBase64} from="generate" />

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: isMobile ? "center" : "flex-start",
                alignItems: "center",
                gap: "1rem",
                mt: isMobile ? 1 : "auto",
                position: isMobile ? "static" : "absolute",
                bottom: isMobile ? "auto" : "2rem",
                left: isMobile ? "auto" : "1rem",
              }}
            >
              <CharacterSelection
                {...{
                  setCharacter,
                  setWaitingForUser,
                  setImageBase64,
                  setTitle,
                  setFeature,
                  setAdvantage,
                  setAdvice,
                  snsCheck,
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={snsCheck}
                    onChange={(e) => setSnsCheck(e.target.checked)}
                    color="primary"
                  />
                }
                label="📸 SNS 掲載 OK"
                sx={{
                  whiteSpace: "nowrap",
                  "& .MuiFormControlLabel-label": { fontSize: "1.2rem" },
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              flex: isMobile ? "none" : "1",
              width: isMobile ? "100%" : "auto",
              height: isMobile ? "auto" : "100%",
              overflowY: isMobile ? "visible" : "auto",
              paddingRight: isMobile ? 0 : "16px",
            }}
          >
            <Box sx={{ p: 4 }}>
              {character && (
                <>
                  {character === "teacher" && <TeacherBadge />}
                  {character === "instructor" && <InstructorBadge />}
                  {character === "geinin" && <GeininBadge />}
                </>
              )}
              <ArtworkTitle title={title} waitingForUser={waitingForUser} />
              <ArtworkDetails
                feature={feature}
                advantage={advantage}
                advice={advice}
                waitingForUser={waitingForUser}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
