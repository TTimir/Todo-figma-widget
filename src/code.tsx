const { widget } = figma;
const {
  useSyncedState,
  useWidgetNodeId,
  usePropertyMenu,
  useEffect,
  AutoLayout,
  Input,
  Text: TextBlock,
  SVG,
  Rectangle,
} = widget;
import { nanoid as createId } from "nanoid/non-secure";

const MAX_FREE_TASKS = 2;

interface Todo {
  id: string;
  title: string;
  done: boolean;
  outOfScope: boolean;
}

interface TodoEditTitleEvent {
  field: "title";
  value: string;
}

interface TodoEditDoneEvent {
  field: "done";
}

interface TodoEditOutOfScopeEvent {
  field: "outOfScope";
}

type TodoEditEvent = {
  id: string;
} & (TodoEditTitleEvent | TodoEditDoneEvent | TodoEditOutOfScopeEvent);

function TodoWidget() {
  const widgetId = useWidgetNodeId();
  const [todos, setTodos] = useSyncedState<Todo[]>("todos", []);
  const [showUpgradeMessage, setShowUpgradeMessage] = useSyncedState<boolean>("showUpgradeMessage", false);
  const [title, setTitle] = useSyncedState<string>("title", "");
  const [hasTitle, setHasTitle] = useSyncedState<boolean>("hasTitle", false);
  const [width, setWidth] = useSyncedState<380 | 440>("width", 380);
  const [size, setSize] = useSyncedState<number>("size", 1);

  useEffect(() => {
    figma.ui.onmessage = ({ type, id, title }) => {
      switch (type) {
        case "update-title":
          updateTodo({ id, field: "title", value: title });
          break;
        case "flip-todo-scope":
          updateTodo({ id, field: "outOfScope" });
          break;
        case "delete-todo":
          deleteTodo(id);
          figma.closePlugin();
          break;
        default:
          figma.closePlugin();
          break;
      }
    };
  });

  const deleteTodo = (id: string) =>
    setTodos(todos.filter((todo) => todo.id !== id));

  const createTodo = async (id: string) => {
    const activeTasks = todos.filter(todo => !todo.done && !todo.outOfScope).length;
    
    if (activeTasks >= MAX_FREE_TASKS) {
      if (!figma.payments) {
        figma.notify("Payments are not available in this context");
        return;
      }

      try {
        // ✨ Changed: Using status property directly instead of trying to call get()
        if (figma.payments.status.type === "PAID") {
        // ✨ Added: Allow task creation for paid users
        setShowUpgradeMessage(false);
        } else {
          setShowUpgradeMessage(true);
          return;
        }
      } catch (error) {
        console.error("Failed to check payment status:", error);
        figma.notify("Failed to verify payment status");
        return;
      }
    }

    setTodos([
      ...todos,
      {
        id,
        title: "",
        done: false,
        outOfScope: false,
      },
    ]);
  };

  function updateTodo(editedTodo: TodoEditEvent) {
    if (editedTodo.field === "title" && "value" in editedTodo) {
      return setTodos(
        todos.map((todo) =>
          todo.id === editedTodo.id
            ? { ...todo, title: editedTodo.value }
            : todo
        )
      );
    }

    const todo = todos.find((todo) => todo.id === editedTodo.id);
    const rest = todos.filter((todo) => todo.id !== editedTodo.id);
    
    if (!todo) return;
    
    if (editedTodo.field === "outOfScope") {
      setTodos([...rest, { ...todo, outOfScope: !todo.outOfScope }]);
    } else if (editedTodo.field === "done") {
      setTodos([...rest, { ...todo, done: !todo.done }]);
    } 
  }

  const titleActionItem: WidgetPropertyMenuActionItem = hasTitle
    ? {
        tooltip: "Remove Title",
        propertyName: "remove-title",
        itemType: "action",
        icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L11.9291 2.36383C11.9159 2.32246 11.897 2.28368 11.8732 2.24845C11.7923 2.12875 11.6554 2.05005 11.5001 2.05005H3.50005C3.29909 2.05005 3.1289 2.18178 3.07111 2.3636C3.05743 2.40665 3.05005 2.45249 3.05005 2.50007V4.50001C3.05005 4.74854 3.25152 4.95001 3.50005 4.95001C3.74858 4.95001 3.95005 4.74854 3.95005 4.50001V2.95005H6.95006V7.34284L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L6.95006 8.75705V12.0501H5.7544C5.50587 12.0501 5.3044 12.2515 5.3044 12.5001C5.3044 12.7486 5.50587 12.9501 5.7544 12.9501H9.2544C9.50293 12.9501 9.7044 12.7486 9.7044 12.5001C9.7044 12.2515 9.50293 12.0501 9.2544 12.0501H8.05006V7.65705L13.3536 2.35355ZM8.05006 6.24284L11.0501 3.24283V2.95005H8.05006V6.24284Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
      }
    : {
        tooltip: "Add a Title",
        propertyName: "add-title",
        itemType: "action",
        icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.94993 2.95002L3.94993 4.49998C3.94993 4.74851 3.74845 4.94998 3.49993 4.94998C3.2514 4.94998 3.04993 4.74851 3.04993 4.49998V2.50004C3.04993 2.45246 3.05731 2.40661 3.07099 2.36357C3.12878 2.18175 3.29897 2.05002 3.49993 2.05002H11.4999C11.6553 2.05002 11.7922 2.12872 11.8731 2.24842C11.9216 2.32024 11.9499 2.40682 11.9499 2.50002L11.9499 2.50004V4.49998C11.9499 4.74851 11.7485 4.94998 11.4999 4.94998C11.2514 4.94998 11.0499 4.74851 11.0499 4.49998V2.95002H8.04993V12.05H9.25428C9.50281 12.05 9.70428 12.2515 9.70428 12.5C9.70428 12.7486 9.50281 12.95 9.25428 12.95H5.75428C5.50575 12.95 5.30428 12.7486 5.30428 12.5C5.30428 12.2515 5.50575 12.05 5.75428 12.05H6.94993V2.95002H3.94993Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
      };

  const propertyMenuItems: WidgetPropertyMenuItem[] = [
    titleActionItem,
    {
      itemType: "separator",
    },
    {
      tooltip: "Make it smaller",
      propertyName: "shrink",
      itemType: "action",
      icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
    },
    {
      tooltip: "Make it bigger",
      propertyName: "grow",
      itemType: "action",
      icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
    },
    {
      itemType: "separator",
    },
    {
      tooltip: "Clear it",
      propertyName: "clear-all",
      itemType: "action",
      icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.60913 0.0634287C4.39082 0.0088505 4.16575 0.12393 4.08218 0.332867L3.1538 2.6538L0.832866 3.58218C0.702884 3.63417 0.604404 3.7437 0.566705 3.87849C0.528906 4.01329 0.555994 4.158 0.639992 4.26999L2.01148 6.09864L1.06343 9.89085C1.00944 10.1068 1.12145 10.3298 1.32691 10.4154L4.20115 11.613L5.62557 13.7496C5.73412 13.9124 5.93545 13.9864 6.12362 13.9327L9.62362 12.9327C9.62988 12.9309 9.63611 12.929 9.64229 12.9269L12.6423 11.9269C12.7923 11.8769 12.905 11.7519 12.9393 11.5976L13.9393 7.09761C13.9776 6.92506 13.9114 6.74605 13.77 6.63999L11.95 5.27499V2.99999C11.95 2.82955 11.8537 2.67373 11.7012 2.5975L8.70124 1.0975C8.67187 1.08282 8.64098 1.07139 8.60913 1.06343L4.60913 0.0634287ZM11.4323 6.01173L12.7748 7.01858L10.2119 9.15429C10.1476 9.20786 10.0995 9.2783 10.0731 9.35769L9.25382 11.8155L7.73849 10.8684C7.52774 10.7367 7.25011 10.8007 7.11839 11.0115C6.98667 11.2222 7.05074 11.4999 7.26149 11.6316L8.40341 12.3453L6.19221 12.9771L4.87441 11.0004C4.82513 10.9265 4.75508 10.8688 4.67307 10.8346L2.03046 9.73352L2.85134 6.44999H4.99999C5.24852 6.44999 5.44999 6.24852 5.44999 5.99999C5.44999 5.75146 5.24852 5.54999 4.99999 5.54999H2.72499L1.7123 4.19974L3.51407 3.47903L6.35769 4.4269C6.53655 4.48652 6.73361 4.42832 6.85138 4.28111L8.62413 2.06518L11.05 3.27811V5.19533L8.83287 6.08218C8.70996 6.13134 8.61494 6.23212 8.57308 6.35769L8.07308 7.85769C7.99449 8.09346 8.12191 8.34831 8.35769 8.4269C8.59346 8.50549 8.84831 8.37807 8.9269 8.14229L9.3609 6.84029L11.4323 6.01173ZM7.71052 1.76648L6.34462 3.47386L4.09505 2.724L4.77192 1.03183L7.71052 1.76648ZM10.2115 11.7885L12.116 11.1537L12.7745 8.19034L10.8864 9.76374L10.2115 11.7885Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
    },
  ];

  usePropertyMenu(propertyMenuItems, ({ propertyName }) => {
    if (propertyName === 'grow' || propertyName === 'shrink') {
      const newSize = propertyName === "grow" ? size * 1.3 : size / 1.3;
      return setSize(newSize);
    }
    
    switch (propertyName) {
      case "clear-all":
        setTodos([]);
        setHasTitle(false);
        setTitle("");
        break;
      case "add-title":
        setHasTitle(true);
        break;
      case "remove-title":
        setHasTitle(false);
        break;
      case "toggle-width":
        setWidth(width === 440 ? 380 : 440)
        break;
    }
  });

  const Todo = (todo: Todo) => {
    const { id, done, title, outOfScope } = todo;
    return (
      <AutoLayout
        key={id}
        direction={"horizontal"}
        verticalAlignItems={"start"}
        spacing={40 * size}
        width={"fill-parent"}
      >
        <AutoLayout
          direction={"horizontal"}
          verticalAlignItems={"start"}
          spacing={8 * size}
          width='fill-parent'
        >
          <AutoLayout
            hidden={done || outOfScope}
            height={20 * size}
            width={20 * size}
            verticalAlignItems={"center"}
            horizontalAlignItems={"center"}
            padding={4 * size}
            onClick={() => updateTodo({ id, field: "done" })}
          >
            <Rectangle
              fill={"#fff"}
              stroke="#aeaeae"
              strokeWidth={1 * size}
              strokeAlign="inside"
              height={16 * size}
              width={16 * size}
              cornerRadius={4 * size}
            />
          </AutoLayout>
          <SVG
            hidden={!done || outOfScope}
            onClick={() => updateTodo({ id, field: "done" })}
            height={20 * size}
            width={20 * size}
            src={`
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C3.79086 2 2 3.79086 2 6V14C2 16.2091 3.79086 18 6 18H14C16.2091 18 18 16.2091 18 14V6C18 3.79086 16.2091 2 14 2H6ZM14.3408 8.74741C14.7536 8.28303 14.7118 7.57195 14.2474 7.15916C13.783 6.74638 13.0719 6.78821 12.6592 7.25259L10.6592 9.50259L9.45183 10.8608L7.7955 9.2045C7.35616 8.76516 6.64384 8.76516 6.2045 9.2045C5.76517 9.64384 5.76517 10.3562 6.2045 10.7955L8.7045 13.2955C8.92359 13.5146 9.22334 13.6336 9.53305 13.6245C9.84275 13.6154 10.135 13.479 10.3408 13.2474L12.3408 10.9974L14.3408 8.74741Z" fill="#4AB393"/>
              </svg>
            `}
          />
          <Rectangle
            hidden={!outOfScope}
            fill={"#f2f2f2"}
            width={20 * size}
            height={20 * size}
          />
          <Input
            fill={outOfScope ? "#6E6E6E" : done ? "#767676" : "#101010"}
            fontSize={(done || outOfScope ? 13 : 14) * size}
            lineHeight={20 * size}
            width='fill-parent'
            value={title}
            placeholder="I need to..."
            placeholderProps={{
              fill: "#b7b7b7",
              opacity: 1,
              letterSpacing: -0.15,
            }}
            onTextEditEnd={(e: TextEditEvent) => {
              e.characters === ""
                ? deleteTodo(id)
                : updateTodo({ id, field: "title", value: e.characters });
            }}
          />
        </AutoLayout>
        <AutoLayout
          fill={outOfScope ? "#f2f2f2" : "#fff"}
          onClick={() =>
            new Promise(async () => {
              try {
                const widget = await figma.getNodeByIdAsync(widgetId) as WidgetNode;

                const absoluteX = widget.absoluteTransform[0][2];
                const absoluteY = widget.absoluteTransform[1][2];

                figma.showUI(__html__, {
                  height: 76,
                  width: 220,
                  title,
                  position: {
                    y: absoluteY - 58,
                    x: absoluteX + widget.width + 7,
                  },
                });
  
                figma.ui.postMessage({ type: "ui", id, title, outOfScope });
              } catch (e) {
                console.error(e)
              }
            })
          }
        >
          <SVG
            height={20 * size}
            width={20 * size}
            src={`
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.6" y="8" width="4" height="4" rx="2" fill="#AAAAAA"/>
                <rect x="8" y="8" width="4" height="4" rx="2" fill="#AAAAAA"/>
                <rect x="14.4" y="8" width="4" height="4" rx="2" fill="#AAAAAA"/>
              </svg>
            `}
          />
        </AutoLayout>
      </AutoLayout>
    );
  };

  const handleUpgradeClick = async () => {
    if (!figma.payments) {
      figma.notify("Payments not available");
      return;
    }

    try {
      await figma.payments.initiateCheckoutAsync({
        interstitial: "PAID_FEATURE"
      });
      
      if (figma.payments.status.type === "PAID") {
        figma.notify("Thank you for upgrading!");
        setShowUpgradeMessage(false);
      } else if (figma.payments.status.type === "UNPAID") {
        figma.notify("Upgrade required to add more tasks");
      } else {
        figma.notify("Payment status could not be determined");
      }
    } catch (error) {
      console.error(error);
      figma.notify("Failed to initiate payment");
    }
  };

  return (
    <AutoLayout
      direction={"vertical"}
      cornerRadius={8 * size}
      fill={"#fff"}
      width={width * size}
      stroke={"#e7e7e7"}
      strokeWidth={1 * size}
    >
      {hasTitle && (
        <AutoLayout
          width="fill-parent"
          direction="vertical"
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <Input
            value={title}
            placeholder="Title"
            fill="#2A2A2A"
            fontWeight={700}
            fontSize={19.8 * size}
            lineHeight={24 * size}
            horizontalAlignText="center"
            width={290 * size}
            letterSpacing={-0.15 * size}
            inputFrameProps={{
              fill: "#FFFFFF",
              horizontalAlignItems: "center",
              padding: { top: 24 * size },
              verticalAlignItems: "center",
            }}
            onTextEditEnd={(e: TextEditEvent) => setTitle(e.characters)}
          />
        </AutoLayout>
      )}
      <AutoLayout
        direction={"vertical"}
        spacing={24 * size}
        padding={24 * size}
        width={"fill-parent"}
      >
        <AutoLayout
          direction={"vertical"}
          spacing={8 * size}
          width={"fill-parent"}
        >
          {todos
            .filter(({ done, outOfScope }) => !done && !outOfScope)
            .map(({ id, title, done, outOfScope }) => (
              <Todo
                key={id}
                id={id}
                title={title}
                done={done}
                outOfScope={outOfScope}
              />
            ))}
          <AutoLayout width={"fill-parent"}>
            <AutoLayout
              direction={"horizontal"}
              verticalAlignItems={"center"}
              spacing={8 * size}
              fill={"#fff"}
              onClick={() => createTodo(createId())}
            >
              <SVG
                height={20 * size}
                width={20 * size}
                src={`
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.125 5C10.7463 5 11.25 5.44772 11.25 6V14C11.25 14.5523 10.7463 15 10.125 15C9.50368 15 9 14.5523 9 14V6C9 5.44772 9.50368 5 10.125 5Z" fill="#979797"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 9.875C5 9.25368 5.44772 8.75 6 8.75L14 8.75C14.5523 8.75 15 9.25368 15 9.875C15 10.4963 14.5523 11 14 11L6 11C5.44772 11 5 10.4963 5 9.875Z" fill="#979797"/>
                </svg>
                `}
              />
              <TextBlock
                fill={"#949494"}
                fontSize={14 * size}
                lineHeight={20 * size}
                fontWeight={700}
                letterSpacing={"-0.75%"}
              >
                Add a todo task
              </TextBlock>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
        <AutoLayout
          hidden={
            !todos.filter(({ done, outOfScope }) => done && !outOfScope).length
          }
          direction={"vertical"}
          spacing={8 * size}
          width={"fill-parent"}
        >
          {todos
            .filter(({ done, outOfScope }) => done && !outOfScope)
            .map(({ id, title, done, outOfScope }) => (
              <Todo
                key={id}
                id={id}
                title={title}
                done={done}
                outOfScope={outOfScope}
              />
            ))}
        </AutoLayout>

        {showUpgradeMessage && (
          <AutoLayout
            direction="vertical"
            width="fill-parent"
            spacing={16 * size}
          >
            <AutoLayout
              direction="horizontal"
              width="fill-parent"
              padding={16 * size}
              fill="#FFF3E6"
              cornerRadius={8 * size}
              stroke="#FFB459"
              strokeWidth={1 * size}
              spacing={8 * size}
            >
              <SVG
                height={20 * size}
                width={20 * size}
                src={`
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM9.25 6C9.25 5.58579 9.58579 5.25 10 5.25C10.4142 5.25 10.75 5.58579 10.75 6V11C10.75 11.4142 10.4142 11.75 10 11.75C9.58579 11.75 9.25 11.4142 9.25 11V6ZM10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z" fill="#FFB459"/>
                  </svg>
                `}
              />
              <TextBlock
                fill="#B55B08"
                fontSize={14 * size}
                width="fill-parent"
              >
                You've reached the free plan limit. Please upgrade to add more tasks.
              </TextBlock>
              <SVG
                height={20 * size}
                width={20 * size}
                src={`
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5L15 15" stroke="#FFB459" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                `}
                onClick={() => setShowUpgradeMessage(false)}
              />
            </AutoLayout>
            <AutoLayout
              direction="horizontal"
              width="fill-parent"
              spacing={8 * size}
              horizontalAlignItems="center"
              verticalAlignItems="center"
            >
              <AutoLayout
                onClick={handleUpgradeClick}
                fill="#FFB459"
                padding={{
                  vertical: 8 * size,
                  horizontal: 16 * size
                }}
                cornerRadius={6 * size}
                hoverStyle={{
                  fill: "#E69D3F"
                }}
              >
                <TextBlock
                  fill="#FFFFFF"
                  fontSize={14 * size}
                  fontWeight={600}
                >
                  Upgrade Plan
                </TextBlock>
              </AutoLayout>
              <AutoLayout
                onClick={() => setShowUpgradeMessage(false)}
                padding={{
                  vertical: 8 * size,
                  horizontal: 16 * size
                }}
                cornerRadius={6 * size}
                stroke="#E0E0E0"
                strokeWidth={1 * size}
                hoverStyle={{
                  fill: "#F5F5F5"
                }}
              >
                <TextBlock
                  fill="#666666"
                  fontSize={14 * size}
                  fontWeight={500}
                >
                  Maybe Later
                </TextBlock>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        )}
      </AutoLayout>
      <AutoLayout
        hidden={todos.filter(({ outOfScope }) => outOfScope).length === 0}
        width={"fill-parent"}
        height={
          !todos.filter(({ outOfScope }) => outOfScope).length
            ? 40 * size
            : "hug-contents"
        }
        direction={"vertical"}
        horizontalAlignItems={"center"}
        spacing={8 * size}
        padding={24 * size}
        fill={"#f2f2f2"}
      >
        {todos
          .filter(({ outOfScope }) => outOfScope)
          .map(({ id, title, done, outOfScope }) => (
            <Todo
              key={id}
              id={id}
              title={title}
              done={done}
              outOfScope={outOfScope}
            />
          ))}
      </AutoLayout>
      <AutoLayout
        width={8}
        positioning="absolute"
        cornerRadius={1000}
        tooltip={width === 380 ? "Make it wider" : "Make it narrower"}
        x={{
          type: "right",
          offset: 0,
        }}
        y={{
          type: "top-bottom",
          topOffset: 0,
          bottomOffset: 0,
        }}
        onClick={() => setWidth(width === 380 ? 440 : 380)}
      />
    </AutoLayout>
  );
}

widget.register(TodoWidget);

