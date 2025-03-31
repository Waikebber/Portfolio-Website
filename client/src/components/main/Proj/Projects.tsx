'use client';

import { Box, Grid, GridItem, Heading } from '@chakra-ui/react';
import { useState } from 'react';
import ProjDescription from './ProjDescription/ProjDescription';
import useProjects from '@/hooks/useProjects';
import { Project } from '@/types';


const Projects = () => {
  const { 
    projects,
    projectGridAreaMap,
    fitImageMap,
    imagePositionMap,
    } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleOpen = (project: Project) => {
    setSelectedProject(project);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedProject(null);
  };

  return (
    <Box id="projects-section" px={8} py={12} bg="var(--main-color)">
      <Grid
        className="proj-container"
        templateAreas={{
          base: `"box-1 box-1"
                 "box-4 box-4"
                 "box-5 box-5"
                 "box-8 box-9"
                 "box-3 box-6"
                 "box-2 box-7"`,

          md: `"box-1 box-1 box-2"
               "box-6 box-5 box-5"
               "box-4 box-4 box-9"
               "box-8 box-7 box-3"`,

          xl: `"box-2 box-2 box-1 box-1 box-1 box-3 box-3 box-3"
               "box-7 box-4 box-4 box-5 box-5 box-3 box-3 box-3"
               "box-7 box-4 box-4 box-5 box-5 box-6 box-6 box-6"
               "box-7 box-8 box-8 box-8 box-9 box-6 box-6 box-6"`,
        }}
        gridAutoRows="180px"
        rowGap={4}
        columnGap={4}
      >
        {/* Title Block in box-1 */}
        <GridItem
          area="box-1"
          h="100%"
          minW="250px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="var(--secondary-color)"
          borderRadius="2xl"
          shadow="lg"
        >
          <Heading fontSize={{ base: '5vh', md: '5.5vh' }} textAlign="center">
            Projects
          </Heading>
        </GridItem>

        {/* Project Tiles */}
        {projects.map((proj, index) => {
          const bgFit = fitImageMap[proj.title] ? 'contain' : 'cover';
          const bgPosition = imagePositionMap[proj.title] || 'center';

          return (
            <GridItem
              key={`grid-${proj.title}`}
              area={projectGridAreaMap[proj.title] ?? `box-${index + 2}`}
              borderRadius="2xl"
              overflow="hidden"
              p={0}
              position="relative"
            >
              <Box
                onClick={() => handleOpen(proj)}
                bgImage={`url(${proj.displayImage})`}
                bgSize={bgFit}
                bgRepeat="no-repeat"
                backgroundPosition={bgPosition}
                h="100%"
                w="100%"
                borderRadius="2xl"
                cursor="pointer"
                border="1vh solid var(--secondary-color)"
                position="relative"
                overflow="hidden"
                transition="all 0.2s ease"
                _hover={{
                  transform: 'scale(1.02)',
                  '& .project-title-container': {
                    opacity: 1,
                  },
                  '& .project-overlay': {
                    opacity: 0.7
                  }
                }}
              >
                {/* Project Box*/}
                <Box
                  className="project-overlay"
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  opacity={0}
                  transition="opacity 0.3s ease"
                />

                {/* Project title */}
                <Box
                  className="project-title-container"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  w="70%"
                  opacity={0}
                  transition="opacity 0.3s ease"
                  zIndex={2}
                  textAlign="center"
                >
                  <Box
                    bg="var(--bkg-color)"
                    borderRadius="md"
                    px={4}
                    py={3}
                    boxShadow="md"
                    display="inline-flex" // Changed to flex for better text control
                    maxW="100%"
                  >
                    <Heading 
                      size="md" 
                      color="var(--text-color)"
                      whiteSpace="normal"
                      fontSize={{ base: 'lg', md: 'xl' }}
                      lineHeight="shorter"
                      wordBreak="normal"
                      textOverflow="ellipsis"
                      css={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 4,
                        overflow: 'hidden',
                        '@media (max-width: 480px)': {
                          fontSize: 'calc(1rem + 0.5vw)'
                        }
                      }}
                    >
                      {proj.title}
                    </Heading>
                  </Box>
                </Box>
              </Box>
            </GridItem>
          );
        })}
      </Grid>

      {selectedProject && (
        <ProjDescription
          isOpen={isOpen}
          onClose={handleClose}
          title={selectedProject.title}
          subtitle={selectedProject.type}
          description={selectedProject.description}
          imageUrl={selectedProject.image}
          link={selectedProject.link}
          linkImage={selectedProject.linkImage}
        />
      )}
    </Box>
  );
};

export default Projects;