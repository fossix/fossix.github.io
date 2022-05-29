---
title:  "Writing containers in Linux"
summary: "Literate programming attempt of writing containers"
date:   2020-10-01 10:28:45 +0530
categories: snippets
tags: [linux, containers]
author: santosh
---

## Creating Containers
A basic contianer can be created with minimal amount of code.

### Container

```c
struct container {
	char *name;
	char *rootfs;
	char *cmd;
	void *stack;
};

struct container *new_container(char *name, char *rootfs, char *cmd)
{
	struct container *c;

	c = calloc(sizeof(struct container), 1);
	if (!c)
		err(errno, "Container");

	c->name = strdup(name);
	c->rootfs = strdup(rootfs);
	c->cmd = strdup(cmd);

	if (!c->name || !c->rootfs || !c->cmd)
		err(errno, "Container");

	return c;
}
```

### Cloning Process

Clone process using the \`clone\` system call with the appropriate namespace
flags to create a new namespace for the contianer.

```c
#define STACK_SIZE (1024 * 1024)

int run_container(struct container *c)
{
	int pid;

	/* We will add the network namespace later */
	int cloneflags = CLONE_NEWPID|CLONE_NEWNS|CLONE_NEWUTS|CLONE_NEWIPC;
	cloneflags |= SIGCHLD;

	c->stack = malloc(STACK_SIZE);
	if (!c->stack)
		err(errno, "Stack creation");

	printf("Cloning\n");
	pid = clone(_container_exec, c->stack + STACK_SIZE, cloneflags, (void *) c);
	if (pid == -1)
		err(errno, "Clone");

	printf("Cloned\n");

	return pid;
}
```

### Change root filesystem

```c
    if (chroot(c->rootfs) == -1)
            err(errno, "chroot");
    
    if (chdir(c->rootfs) == -1)
            err(errno, "chdir");
    
    /* mount proc so we can run `ps` etc */
    if (mount("proc", "/proc", "proc", 0, NULL) == -1)
            err(errno, "mount");
```

<!-- ### Change memory, cpu, network limits using cgroups -->


<!-- ### Execute the main container process -->

