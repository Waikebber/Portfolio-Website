'use client';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { Box, Heading, Text, Image, CloseButton, Link, HStack } from '@chakra-ui/react';

interface ProjDescriptionProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  link: string;
  linkImage: string;
}

const ProjDescription = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  imageUrl,
  link,
  linkImage,
}: ProjDescriptionProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => onClose()}>
      <Portal>
        <Dialog.Backdrop
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            position: 'fixed',
            inset: 0,
            zIndex: 999,
          }}
        />
        <Dialog.Positioner
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        >
          <Dialog.Content
            style={{
              width: '90vw',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              position: 'relative',
            }}
          >
            <CloseButton
              onClick={onClose}
              position="absolute"
              top="1rem"
              right="1rem"
              size="sm"
              borderRadius="full"
              bg="gray.100"
              _hover={{ bg: 'gray.300' }}
            />

            <Dialog.Title>
              <Heading size="lg">{title}</Heading>
              <Text fontSize="md" mt={2} color="gray.600">
                {subtitle}
              </Text>
            </Dialog.Title>

            <Dialog.Description>
              <Text
                fontSize="sm"
                mt={4}
                dangerouslySetInnerHTML={{ __html: description }}
              />

              {imageUrl && (
                <Box mt={4}>
                  <Image
                    src={imageUrl}
                    alt={`${title} image`}
                    borderRadius="xl"
                    maxW="100%"
                  />
                </Box>
              )}

              {link && linkImage && (
                <HStack mt={6} gap={3}>
                  <Image
                    src={linkImage}
                    alt="Link icon"
                    boxSize="24px"
                    objectFit="contain"
                  />
                  <Link
                    href={link}
                    color="blue.500"
                    fontWeight="semibold"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    View Project
                  </Link>
                </HStack>
              )}
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProjDescription;
