'use client';
import { Flex } from "@chakra-ui/react";
import MediaButton from "./mediaButton/MediaButton";

const MediaButtonWrapper = ({
  showTooltip = true,
}
) => {
  return (
    <Flex as="ul" display="inline-flex" listStyleType="none">
      <MediaButton
        imagePath="/assets/icons/email-icon.png"
        linkName="Email"
        linkUrl="mailto:your-email@example.com"
        color="#0000FF"
        showTooltip={showTooltip}
      />
      <MediaButton
        imagePath="/assets/icons/linkedin-icon.png"
        linkName="Linkedin"
        linkUrl="https://www.linkedin.com/in/kai-webber/"
        color="#0077b5"
        showTooltip={showTooltip}
      />
      <MediaButton
        imagePath="/assets/icons/github-icon.png"
        linkName="Github"
        linkUrl="https://github.com/Waikebber"
        color="#333333"
        showTooltip={showTooltip}
      />
      <MediaButton
        imagePath="/assets/icons/instagram-icon.png"
        linkName="Instagram"
        linkUrl="https://www.instagram.com/k_webb_photos/"
        color="#e4405f"
        showTooltip={showTooltip}
      />
    </Flex>
  );
};

export default MediaButtonWrapper;