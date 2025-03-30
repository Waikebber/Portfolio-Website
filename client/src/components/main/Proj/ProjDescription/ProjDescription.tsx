'use client';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { Box, Heading, Text, Image, CloseButton, Link, Flex, useBreakpointValue } from '@chakra-ui/react';

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
  const linkPosition = useBreakpointValue({
    base: 'above',
    md: 'overlay'
  });

  return (
    <Dialog.Root open={isOpen}>
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
              background: 'var(--bkg-color)',
              borderRadius: '1rem',
              padding: '2rem',
              position: 'relative',
              border: '2px solid var(--secondary-color)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CloseButton
              onClick={onClose}
              position="absolute"
              top="1rem"
              right="1rem"
              size="sm"
              borderRadius="full"
              bg="var(--secondary-color)"
              color="var(--text-color)"
              _hover={{ bg: 'var(--main-color)', color: 'white' }}
            />

            <Dialog.Title>
              <Heading size="xl" color="var(--text-color)" mb={2}>
                {title}
              </Heading>
              <Text fontSize="lg" color="var(--text-color)" opacity={0.8}>
                {subtitle}
              </Text>
            </Dialog.Title>

            <Dialog.Description>
              <Text
                fontSize="md"
                mt={4}
                color="var(--text-color)"
                lineHeight="tall"
                dangerouslySetInnerHTML={{ __html: description }}
              />

              {link && linkImage && linkPosition === 'above' && (
                <Flex
                  mt={4}
                  bg="var(--bkg-color)"
                  borderRadius="md"
                  p={2}
                  border="1px solid var(--secondary-color)"
                  boxShadow="md"
                  alignItems="center"
                  gap={2}
                  w="fit-content"
                  mx="auto"
                  justifyContent="center"
                >
                  <Image
                    src={linkImage}
                    alt="Link icon"
                    boxSize="16px"
                    objectFit="contain"
                    filter="var(--link-icon-filter)"
                  />
                  <Link
                    href={link}
                    color="var(--link-color)"
                    fontWeight="semibold"
                    _hover={{ 
                      textDecoration: 'underline',
                      color: 'var(--link-hover-color)'
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="sm"
                  >
                    View Project
                  </Link>
                </Flex>
              )}

              {imageUrl && (
                <Box 
                  mt={4} 
                  position="relative" 
                  maxW="90%" 
                  mx="auto"
                  borderRadius="xl"
                  overflow="hidden"
                  bg="white"
                >
                  <Image
                    src={imageUrl}
                    alt={`${title} image`}
                    width="100%"
                    height="auto"
                    maxH="400px"
                    objectFit="cover"
                    display="block"
                  />
                  {link && linkImage && linkPosition === 'overlay' && (
                    <Flex
                      position="absolute"
                      bottom="4"
                      right="4"
                      bg="var(--bkg-color)"
                      borderRadius="md"
                      p={2}
                      border="1px solid var(--secondary-color)"
                      boxShadow="md"
                      alignItems="center"
                      gap={2}
                    >
                      <Image
                        src={linkImage}
                        alt="Link icon"
                        boxSize="16px"
                        objectFit="contain"
                        filter="var(--link-icon-filter)"
                      />
                      <Link
                        href={link}
                        color="var(--link-color)"
                        fontWeight="semibold"
                        _hover={{ 
                          textDecoration: 'underline',
                          color: 'var(--link-hover-color)'
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize="sm"
                      >
                        View Project
                      </Link>
                    </Flex>
                  )}
                </Box>
              )}
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProjDescription;